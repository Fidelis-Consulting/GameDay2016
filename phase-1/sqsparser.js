var AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    accessKeyId: 'ASIAI5VNHXN75IDGQFMQ',
    secretAccessKey: 'AaECNm8iVBb4v0yIFCsnMNeH07+FCmXyHZDrrodm',
    sessionToken: 'FQoDYXdzEDwaDIuSD0ddrJTNEWxO4SLZAZ7jC1csAm2cBvfQhIlEEeVMLqh5CVX0lxzEvhALYkvLSzoj44SpCW4Ldy9/uKz0n6Qi+WhhU+qF28knAKACRbil1Pn+LzhXKDp+MsQrSZdq0twaKWU1IPQkqOAwfgKZv6EO+pLiHXOIzsFteUJMYQr2pp4ibuHS1ZB+NhsC8joWxGsIlldfRff5KCKX5+nN99F8/gFI438IoF156yJRwNt29g0FvZYLY9m0Ex99wZDBL9q454vwwTO83pJlfb6bPmAi+t2kpnRv6gpJzcoTsEISIp/R5sQMlRsoneTzwQU='
});


var Consumer = require('sqs-consumer');
var redis = require('redis');
var host = "unicorns3.tvmx6i.0001.euc1.cache.amazonaws.com";
var port = 6379;

var app = Consumer.create({
    queueUrl: 'https://sqs.eu-central-1.amazonaws.com/748244679595/disposableunicorns2',
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

