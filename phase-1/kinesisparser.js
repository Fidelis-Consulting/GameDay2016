var redis = require('redis');
var host = "unicorns.a0yryy.0001.euc1.cache.amazonaws.com";
var port = 6379;

var recordProcessor = {
    initialize: function(initializeInput, completeCallback) {
        // Your application specific initialization logic.

        // After initialization is done, call completeCallback,
        // to let the KCL know that the initialize operation is
        // complete.
        completeCallback();
    },
    processRecords: function(processRecordsInput, completeCallback) {
        // Sample code for record processing.
        if (!processRecordsInput || !processRecordsInput.records) {
            // Invoke callback to tell the KCL to process next batch
            // of records.
            completeCallback();
            return;
        }
        var records = processRecordsInput.records;
        var record, sequenceNumber, partitionKey, data;
        for (var i = 0 ; i < records.length ; ++i) {
            record = records[i];
            sequenceNumber = record.sequenceNumber;
            partitionKey = record.partitionKey;
            // Data is in base64 format.
            data = new Buffer(record.data, 'base64').toString();
            console.log(data);
            /*
            var client = redis.createClient(port, host);
            client.on('connect', function() {
                console.log('connected to redis');
                client.rpush(data.Id, JSON.stringify(data));
                console.log('Pushed message to redis');
            });
*/

        }
        // Checkpoint last sequence number.
        processRecordsInput.checkpointer.checkpoint(
            sequenceNumber, function(err, sn) {
                // Error handling logic. In this case, we call
                // completeCallback to process more data.
                completeCallback();
            }
        );
    },
    shutdown: function(shutdownInput, completeCallback) {
        // Your shutdown logic.

        if (shutdownInput.reason !== 'TERMINATE') {
            completeCallback();
            return;
        }
        shutdownInput.checkpointer.checkpoint(function(err) {
            // Error handling logic.
            // Invoke the callback at the end to mark the shutdown
            // operation complete.
            completeCallback();
        });
    }
};

var kcl = require('aws-kcl');

kcl(recordProcessor).run();