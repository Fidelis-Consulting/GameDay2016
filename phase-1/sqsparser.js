var Consumer = require('sqs-consumer');
var redis = require('redis');
var host = "";
var port = 6379;

var app = Consumer.create({
    queueUrl: '	https://sqs.eu-central-1.amazonaws.com/896481443273/disposableunicorns',
    region: 'eu-central-1',
    batchSize: 10,
    handleMessage: function (message, done) {
        console.log('recieved SQS message');

        var msgBody = JSON.parse(message.Body);
        console.log(msgBody);

        var client = redis.createClient(port, host);
        client.on('connect', function() {
            console.log('connected to redis');
            client.rpush(msgBody.Id, msgBody);
            console.log('Pushed message to redis');
        });


        return done();

    }
});

app.on('error', function (err) {
    console.log(err);
});

app.start();

