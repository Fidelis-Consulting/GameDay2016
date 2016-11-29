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
$redis->pconnect('EC INSTANCE', 6379);

$data = file_get_contents('php://stdin');

$data = json_decode($data);

$message = $redis->get($data->Id);

if($message == false)
{
	$redis->set($data->Id,array($data));
}
else
{
	$message[] = $data;

	$redis->set($data->Id,$message);
}

