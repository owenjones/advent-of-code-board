<?php
// Simple wrapper around the Advent of Code API to prevent calling it too frequently and to simplify
// the data returned to the leaderboard display (and strip any user IDs etc. from the publicly available output).

ob_start();
require 'vendor/autoload.php';

use \Dotenv\Dotenv;
use \GuzzleHttp\Client;
use \GuzzleHttp\Cookie\CookieJar;
use \GuzzleHttp\Exception\ClientException;
use \Ds\Vector;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if(file_exists($_ENV["CACHE"])) {
  $cache = json_decode(file_get_contents($_ENV["CACHE"]), TRUE);
} else {
  $cache = array();
}

$now = time();
$hour = (int) date("H");

// only update from AOC if: we haven't before, or we have and it was more than 15 mins ago (and it's between 8am and 6pm)
if(!isset($cache['time']) || (isset($cache['time']) && (($now - $cache['time']) > 900) && ($hour >= 8) && ($hour <= 18))) {
  try {
    $month = (int) date("m");
    $year = (string) ($month < 11 ? (((int) date("Y")) - 1) : date("Y")); // switch to current year's event in November
    $url = "https://adventofcode.com/" . $year . "/leaderboard/private/view/" . $_ENV["OWNER_ID"] . ".json";

    $cookies = CookieJar::fromArray(['session' => $_ENV["SESSION"]], ".adventofcode.com");
    $client = new Client();
    $response = $client->request("GET", $url, ["cookies" => $cookies]);

    if($response->getStatusCode() == 200) {
      $data = json_decode((string) $response->getBody(), TRUE);

      if($data == NULL) {
        $cache["status"] = 403;
        $cache["error"] = "Empty response, check session cookie is valid";
      } else {
        $members = new Vector();

        foreach ($data["members"] as $id => $member) {
          $members->push(array("name" => $member["name"], "stars" => $member["stars"], "last" => $member["last_star_ts"]));
        }

        // sort by both total number of stars, and by timestamp of last completed star
        // => end result is most completed stars first, with any members with equal stars ordered by
        // who got their stars first
        $members->sort(function($a, $b) {
          if($a["stars"] == $b["stars"]) {
            return $a["last"] <=> $b["last"];
          } else {
            return $b["stars"] <=> $a["stars"];
          }

        });

        // FUTURE: While treversing all members make a note of star completion timestamps (and which day/star)
        // sort these descending and filter the top N to make a 'Recent Activity' log.

        $cache = array();
        $cache["status"] = 200;
        $cache["members"] = $members;
      }

      $cache["time"] = $now;
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
