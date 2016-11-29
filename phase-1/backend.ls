_ = require 'prelude-ls'
Redis = require 'ioredis'
request = require 'request'
Promise = require 'bluebird'

redis = new Redis do
   port: 6379          # Redis port
   host: 'unicorns.a0yryy.0001.euc1.cache.amazonaws.com'   # Redis host
   #host: '127.0.0.1'   # Redis host
   family: 4           # 4 (IPv4) or 6 (IPv6)
   password: ''
   db: 0

API_TOKEN = '00fd67af2a'
API_BASE = 'https://dashboard.cash4code.net/score'

process-keys = (keys) ->
   #console.log "#{JSON.stringify keys, null, 2}"
   keys |> _.each (key) ->
      #console.log "Processing #{key}..."

      # Setup an expiry if not already set
      redis.ttl key
         .then (ttl) ->
            if ttl < 0 then
               console.log "Setting expiry for #{key}"
               redis.expire key, 120

            redis.llen key
               .then (len) ->
                  #console.log "Length: #{len}"
                  redis.lrange key, 0, len
               .then (items) ->
                  #console.log "Raw: #{JSON.stringify items} TTL: #{ttl}"
                  items = items |> _.map (i) -> JSON.parse i
                  #console.log "Items: #{JSON.stringify items, null, 2}"

                  # Someone else might have grabbed it
                  if items.length == 0 then return

                  msg-id = items |> _.head |> (.Id)
                  total-parts = items |> _.head |> (.TotalParts)
                  #console.log "Total-parts: #{total-parts}"

                  parts = items |> _.sort-by (.PartNumber)
                  #console.log "Items: #{JSON.stringify parts, null, 2}"

                  parts1 = [0 til total-parts] |> _.map (part-number) -> (parts |> _.find (.PartNumber == part-number))
                  #console.log "parts1: #{JSON.stringify parts1, null, 2}"

                  if undefined not in parts1 then
                     #console.log "All parts present!"
                     body = parts1 |> _.map (.Data) |> _.Str.join ''
                     url = API_BASE + '/' + msg-id

                     # delete from redis
                     redis.del key

                     # pass to scoreboard
                     console.log "***** Posting #{url} -> #{body}"
                     request.post do
                        do
                           url: url
                           headers:
                              "x-gameday-token": API_TOKEN
                           body: body
                        (err, resp, body) ->
                           console.log "***** Response posted #{err} #{body}"

process-keys-done = ->
   console.log ""

run = ->
   stream =
      redis.scanStream do
         match: "*"
   stream.on 'data', process-keys
   stream.on 'end', ->
      run!

setTimeout do
   -> run!
   100
