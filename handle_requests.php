<?php

/*
{
  “Id”: string,
  “TotalParts”: integer, // Nearly always 2,
  “PartNumber”: integer, // The first part is 0,
  “Data”: string
}
*/


$redis = new Redis();
$redis->connect('unicorns.a0yryy.0001.euc1.cache.amazonaws.com', 6379);

$data = file_get_contents('php://stdin');

$data = json_decode($data);

$redis->lPush($data->Id,$data);

