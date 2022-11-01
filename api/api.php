<?php
// Simple cache layer on the Advent of Code API to prevent calling it too frequently.

// They request no more than once every 15 mins so we'll do once every 30 to start,
// and only between working hours (8am - 6pm).

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
  $cookies = CookieJar::fromArray(['session' => $_ENV["SESSION"]], ".adventofcode.com");
  $client = new Client();
  try {
    $response = $client->request("GET", $_ENV["API"], ["cookies" => $cookies]);

    if($response->getStatusCode() == 200) {
      $cache["status"] = 200;
      $cache["data"] = json_decode((string) $response->getBody());
      $cache["time"] = $now;

      // manipulate data here to simplify displaying?
      // some possible outputs:
      // - array of people to total number of stars
      // - for current day: ordered array of people completed
      // - 'event log' - last things completed and by who

      file_put_contents($_ENV["CACHE"], json_encode($cache));
    } else {
      // if something went wrong: return old cached data (assuming it exists...) but also attach current error so it can eventually get picked up
      $cache["error"] = array("status" => $response->getStatusCode(), "message" => $response->getBody());
    }
  }
  catch(ClientException $e) {
    $cache["error"] = array("status" => 500, "message" => $e->getMessage());
  }
}

header("Content-Type: application/json");
print(json_encode($cache));
