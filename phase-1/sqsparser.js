var AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: 'ASIAIJYNKAGIJ22LZCVQ',
    secretAccessKey: 'lIIkKPe0ly9L3mCK1q54TlXwxONysf897A/H4F20',
    sessionToken: 'FQoDYXdzEDoaDNjQcmpIKJ9/De0UryLZARBHIQunhsHKHcg08ehGS3aITyrxW5NvzyTlHqo/5nsKPD2cXVxz8x9DVxhSv2YWOEE1KMC1T3GhLFdEOPVJI5DvyBZwr7E9jwEzr9STl49oqn0TAfsoAv3aUEajCg196WW6EEmSVT6lywM+Y+tINt/kiKVKw5btWIaovxHnK7je529bmgKi9NcZ/Fghnq61v7WlQfk42xCgbTSE7HMoO+1pd2UcJUBGTkJRGnazJKTBr8PPMH7mBH+6jHMEOXWONJfRSpB7sF9zA/akNpZkdq5nkG1XVvOfO+Qou63zwQU='
});

var Consumer = require('sqs-consumer');
var redis = require('redis');
var host = "unicorns.a0yryy.0001.euc1.cache.amazonaws.com";
var port = 6379;

var app = Consumer.create({
    queueUrl: 'https://sqs.eu-central-1.amazonaws.com/896481443273/disposableunicorns',
    region: 'eu-central-1',
    batchSize: 10,
    handleMessage: function (message, done) {
        console.log('recieved SQS message');

        var msgBody = JSON.parse(message.Body);
        console.log(msgBody);


        var client = redis.createClient(port, host);
        client.on('connect', function() {
            console.log('connected to redis');
            client.rpush(msgBody.Id, JSON.stringify(msgBody));
            console.log('Pushed message to redis');
        });


        return done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();

