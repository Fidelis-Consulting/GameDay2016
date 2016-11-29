var AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: 'ASIAJ66UXXPGA4GV2N5Q',
    secretAccessKey: 'mCogc+xwjDmgbKFXWJcblOhQ+BYt3rsaFxqIYd4o',
    sessionToken: 'FQoDYXdzEDwaDBNp3sAf5zBj9RSVTyLZAZUYgjjgdovV7vD237bHpXZkZRcB+meiNTT0tylOnS9LZX95yM1uKnQQAUXAkpkOp4BH0DXady5V5flxGv0TgdFP2HgT7+yZoQQi3WVS/Fto/b+HzGguYOH0r9imY4YNKe1EZiPR1soRjbIFtMZ3gQoffwaPyT+DEkha2pdY6hOPuvPxcoTEOsmU5+F6B7k+kHWxDeSGZ6tw+DzS7VCHfbbUvKYMiCPH/Y15JYbdH+nr19lokF704Nn2D22SyzsI/Mdpn9CsqArnk5yWvxQjZNmc/fAvKS4hqqgo8t7zwQU='
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

