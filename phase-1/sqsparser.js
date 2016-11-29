var AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: 'ASIAIY4QDTMMJHD7JGUA',
    secretAccessKey: 'U1iTmnu/sQw1QRtGkCsJTSiG6FyBegag5yX1PElq',
    sessionToken: 'FQoDYXdzEDsaDEvVJ7dMMSdEwwE7OyLZAUAnFvb0RTuD2iGhyRKe1EwGSS9q3XSLvBv8KlZSuq6ZnqF4EEIanpGKXcm4+fmYKpC82w2I7ouvrwueb5NoJAf9aD99lhvee/9IOwPWNRtOywS+mWzTm74ehqUOwbBE4G7cWRe4tXLLf70+DzBg7og53qS+bVfbvu//yKUIhWwc5/cfWlSVqg4nqbwoiUhY+6tN/JIYG6xHH+y39VcqaSKkqdhdvfIq4ncdzwCYC3eEmhehNMC0JXMiexfaZpzwM9Mp5IbK5ba467yDKFmZvw6y1+YuGyWEDVso5srzwQU='
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

