#!/usr/bin/env python

import json
import urllib2

import boto3
from boto3 import client

STREAM = "disposableunicorns2"
REDIS_SERVER = 'unicorns3.tvmx6i.0001.euc1.cache.amazonaws.com'

if __name__ == "__main__":
    url = 'https://dashboard.cash4code.net/team/00fd67af2a/apicreds?_=1480380076941'
    req = urllib2.Request(url)
    response = urllib2.urlopen(req)
    bundle_text = response.read()
    bundle = json.loads(bundle_text)
    creds = bundle['Creds']

    SECRET_KEY = creds['SecretAccessKey']
    ACCESS_KEY = creds['AccessKeyId']
    SESSION_TOKEN = creds['SessionToken']

    # Choosing the resource from boto3 module
    s3 = boto3.resource('s3',
                        aws_access_key_id=ACCESS_KEY,
                        aws_secret_access_key=SECRET_KEY,
                        aws_session_token=SESSION_TOKEN,
                        region_name='eu-central-1'
                        )

    s3_client = client('s3',
                       aws_access_key_id=ACCESS_KEY,
                       aws_secret_access_key=SECRET_KEY,
                       aws_session_token=SESSION_TOKEN,
                       region_name='eu-central-1'
                       )

    # for key in s3_client.list_objects(Bucket='disposableunicorns')['Contents']:
    #     print(key['Key'])


    # https://blog.insightdatascience.com/getting-started-with-aws-serverless-architecture-tutorial-on-kinesis-and-dynamodb-using-twitter-38a1352ca16d#.ko4yogwhg


    kinesis = boto3.client('kinesis',
                           aws_access_key_id=ACCESS_KEY,
                           aws_secret_access_key=SECRET_KEY,
                           aws_session_token=SESSION_TOKEN,
                           region_name='eu-central-1'
                           )

    shard_id = "shardId-000000000000"  # only one shard!
    pre_shard_it = kinesis.get_shard_iterator(StreamName=STREAM, ShardId=shard_id, ShardIteratorType="LATEST")
    shard_it = pre_shard_it["ShardIterator"]
    while 1 == 1:
        event = kinesis.get_records(ShardIterator=shard_it, Limit=1)
        shard_it = event["NextShardIterator"]
        # print event;
        for record in event['Records']:
            # Kinesis data is base64 encoded so decode here
            print record['Data']
            data = json.loads(record['Data'])
            print ('Id: ' + data['Id'])

            # payload = base64.b64decode(record['Data'])
            # parse json
            # message = json.loads(payload)
            # parse message
            # msg_id = message['Id']
            # part_number = message['PartNumber']
            # data = message['Data']
            # print msg_id
            # put the part received into dynamo
            # proceed = store_message(msg_id, part_number, data)
            # if proceed is False:
            #     # we have already processed this message so don't proceed
            #     print("skipping duplicate message")
            #     continue
            # # Try to get the parts of the message from the Dynamo.
            # check_messages(msg_id)

            # data = json.loads(out)

            # print ('TotalParts: ' + str(data['TotalParts']))
            # print ('PartNumber: ' + str(data['PartNumber']))
            # print ('Id: ' + data['Id'])
            # print ('Data: ' + data['Data'])
            #
            r_server = redis.Redis(REDIS_SERVER)
            #
            r_server.rpush(data['Id'], json.dumps(data))
            #
