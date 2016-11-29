// Generated by LiveScript 1.4.0
(function(){
  var _, Redis, request, Promise, redis, API_TOKEN, API_BASE, processKeys, processKeysDone, run;
  _ = require('prelude-ls');
  Redis = require('ioredis');
  request = require('request');
  Promise = require('bluebird');
  redis = new Redis({
    port: 6379,
    host: 'unicorns.a0yryy.0001.euc1.cache.amazonaws.com',
    family: 4,
    password: '',
    db: 0
  });
  API_TOKEN = '00fd67af2a';
  API_BASE = 'https://dashboard.cash4code.net/score';
  processKeys = function(keys){
    return _.each(function(key){
      redis.ttl(key).then(function(result){
        if (result < 0) {
          console.log("Setting expiry for " + key);
          return redis.expire(key, 120);
        }
      });
      return redis.llen(key).then(function(len){
        return redis.lrange(key, 0, len);
      }).then(function(items){
        var msgId, totalParts, parts, parts1, body;
        console.log("Raw: " + JSON.stringify(items, null, 2));
        items = _.map(function(i){
          return JSON.parse(i);
        })(
        items);
        if (items.length === 0) {
          return;
        }
        msgId = function(it){
          return it.Id;
        }(
        _.head(
        items));
        totalParts = function(it){
          return it.TotalParts;
        }(
        _.head(
        items));
        parts = _.sortBy(function(it){
          return it.PartNumber;
        })(
        items);
        parts1 = _.map(function(partNumber){
          return _.find(function(it){
            return it.PartNumber === partNumber;
          })(
          parts);
        })(
        (function(){
          var i$, to$, results$ = [];
          for (i$ = 0, to$ = totalParts; i$ < to$; ++i$) {
            results$.push(i$);
          }
          return results$;
        }()));
        if (!in$(undefined, parts1)) {
          body = _.Str.join('')(
          _.map(function(it){
            return it.Data;
          })(
          parts1));
          redis.del(key);
          console.log("***** Posting body: " + body);
          return request.post({
            url: API_BASE + '/' + msgId,
            headers: {
              "x-gameday-token": API_TOKEN
            },
            body: body
          }, function(err, resp, body){
            return console.log("***** Response posted " + err + " " + body);
          });
        }
      });
    })(
    keys);
  };
  processKeysDone = function(){
    return console.log("");
  };
  run = function(){
    var stream;
    stream = redis.scanStream({
      match: "*"
    });
    stream.on('data', processKeys);
    return stream.on('end', function(){
      return run();
    });
  };
  setTimeout(function(){
    return run();
  }, 100);
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
