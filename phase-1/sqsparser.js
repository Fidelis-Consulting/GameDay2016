var AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: 'ASIAJ7NL5H2JUA2R6YBA',
    secretAccessKey: 'QW6ixPdznxmPd/U0/zYlucRWV2DZskxIB/n85DD7',
    sessionToken: 'FQoDYXdzEDoaDDF1uZDViLW2d+ZCdiLZAalonTRNID1WHT/zD0+ay4jyro4NSaeJTRhyTdxKM92vpaVP5xbhbDM60pJMEX/bMYCW0ASmo/Bt+kKHkWN1Z8iL+nMwAkah1kHxlJ3Pbmcz8CiuUZHHoLyXmOlQhlSelQJNb9/Hr91hzjqTowTF6ZqhAi8aZw78jPoEGn8uBPuPmgUZ61vXansWgCxuzOjhmZ/0k0ScN7uQIKkD7NM5qmgWeunFaCG+5djJD5xdywPKCWsOAYYVhkWll8usDh6pKUK+ODcT0xm4WbWeXJOGPtndku8qO0ouwb8or53zwQU='
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

