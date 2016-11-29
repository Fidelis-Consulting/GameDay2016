#!/usr/bin/env python

import json
import urllib2

import boto3
from boto3 import client

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




    STREAM = "disposableunicorns"

    kinesis = boto3.client('kinesis',
                           aws_access_key_id=ACCESS_KEY,
                           aws_secret_access_key=SECRET_KEY,
                           aws_session_token=SESSION_TOKEN,
                           region_name='eu-central-1'
                           )



    # data = json.loads(file_data)
    #
    # print ('TotalParts: ' + str(data['TotalParts']))
    # print ('PartNumber: ' + str(data['PartNumber']))
    # print ('Id: ' + data['Id'])
    # print ('Data: ' + data['Data'])
    #
    # r_server = redis.Redis('unicorns.a0yryy.0001.euc1.cache.amazonaws.com')
    #
    # r_server.rpush(data['Id'], json.dumps(data))
    #
