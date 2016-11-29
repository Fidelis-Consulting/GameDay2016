#!/usr/bin/env python

import json
import urllib2

import boto3
import redis
from boto3 import client

BUCKET = 'disposableunicorns2'
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

    for key in s3_client.list_objects(Bucket=BUCKET)['Contents']:
        print(key['Key'])

        # Download the file from S3
        s3_client.download_file(BUCKET, key['Key'], 'temp.txt')
        file_data = open('temp.txt').read()

        data = json.loads(file_data)

        print ('TotalParts: ' + str(data['TotalParts']))
        print ('PartNumber: ' + str(data['PartNumber']))
        print ('Id: ' + data['Id'])
        print ('Data: ' + data['Data'])

        r_server = redis.Redis('REDIS_SERVER')

        r_server.rpush(data['Id'], json.dumps(data))

        s3_client.delete_object(Bucket=BUCKET, Key=key['Key'])
