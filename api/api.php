<?php
// Simple wrapper around the Advent of Code API to prevent calling it too frequently and to simplify
// the data returned to the leaderboard display (and strip any user IDs etc. from the publicly available output).

ob_start();
require 'vendor/autoload.php';

use \Dotenv\Dotenv;
use \GuzzleHttp\Client;
use \GuzzleHttp\Cookie\CookieJar;
use \GuzzleHttp\Exception\ClientException;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if(file_exists($_ENV["CACHE"])) {
  $cache = json_decode(file_get_contents($_ENV["CACHE"]), TRUE);
} else {
  $cache = array();
}

$now = time();
$hour = (int) date("H");

// only update from AOC if: we haven't before, or we have and it was more than 30 mins ago (and it's between 8am and 6pm)
if(!isset($cache['time']) || (isset($cache['time']) && (($now - $cache['time']) > 1800) && ($hour >= 8) && ($hour <= 18))) {
  try {
    $month = (int) date("m");
    $year = (string) ($month < 11 ? (((int) date("Y")) - 1) : date("Y"));
    $url = "https://adventofcode.com/" . $year . "/leaderboard/private/view/" . $_ENV["OWNER_ID"] . ".json";

    $cookies = CookieJar::fromArray(['session' => $_ENV["SESSION"]], ".adventofcode.com");
    $client = new Client();
    $response = $client->request("GET", $url, ["cookies" => $cookies]);

    if($response->getStatusCode() == 200) {
      $data = json_decode((string) $response->getBody(), TRUE);

      $members = array();
      foreach ($data["members"] as $id => $member) {
        $members[$member["name"]] = $member["stars"];
      }
      arsort($members);

      $cache = array();
      $cache["status"] = 200;
      $cache["time"] = $now;
      $cache["members"] = $members;
      file_put_contents($_ENV["CACHE"], json_encode($cache));
    } else {
      // if we got an unexpected response: return old cached data (if it exists) but also attach current error so it can eventually get picked up
      $cache["status"] = $response->getStatusCode();
      $cache["error"] = $response->getBody();
    }
  }
  catch(ClientException $e) {
    // if the request failed: return old cached data (if it exists) but also attach current error so it can eventually get picked up
    $cache["status"] = 500;
    $cache["error"] = $e->getMessage();
  }
}

header("Content-Type: application/json");
print(json_encode($cache));
