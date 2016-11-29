#!/usr/bin/env python

import json
import urllib2

import boto3

# logging.basicConfig(level=logging.DEBUG)

# https://dashboard.cash4code.net/team/00fd67af2a/apicreds?_=1480380076941

REDIS_SERVER = 'unicorns.a0yryy.0001.euc1.cache.amazonaws.com'
QUEUE = 'disposableunicorns2'

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
    sqs = boto3.resource('sqs',
                         aws_access_key_id=ACCESS_KEY,
                         aws_secret_access_key=SECRET_KEY,
                         aws_session_token=SESSION_TOKEN,
                         )
    ec = boto3.client('elasticache',
                      aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY,
                      aws_session_token=SESSION_TOKEN,
                      )

    # Get the queue named test
    queue = sqs.get_queue_by_name(QueueName=QUEUE)

    # Process messages by printing out body from test Amazon SQS Queue
    # while True:
    for msg in queue.receive_message():
        print (format(msg.body))

    data = json.loads(msg.body)

    print ('TotalParts: ' + str(data['TotalParts']))
    print ('PartNumber: ' + str(data['PartNumber']))
    print ('Id: ' + data['Id'])
    print ('Data: ' + data['Data'])

    r_server = redis.Redis(REDIS_SERVER)

    r_server.rpush(data['Id'], data)

    # msg.delete()
