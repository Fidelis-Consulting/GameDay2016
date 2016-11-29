#!/usr/bin/env python

import json

import boto3

# import redis

# logging.basicConfig(level=logging.DEBUG)



if __name__ == "__main__":

    # Choosing the resource from boto3 module
    sqs = boto3.resource('sqs')
    ec = boto3.client('elasticache')

    # Get the queue named test
    queue = sqs.get_queue_by_name(QueueName='disposableunicorns')

    # Process messages by printing out body from test Amazon SQS Queue
    # while True:
    for msg in queue.receive_messages():
        print (format(msg.body))

    data = json.loads(msg.body)

    print ('TotalParts: ' + str(data['TotalParts']))
    print ('PartNumber: ' + str(data['PartNumber']))
    print ('Id: ' + data['Id'])
    print ('Data: ' + data['Data'])


    # message.delete()
