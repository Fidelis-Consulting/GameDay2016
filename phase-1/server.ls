_ = require 'prelude-ls'
express = require 'express'
body-parser = require 'body-parser'
request = require 'request'
#Redis = require 'ioredis'

API_TOKEN = '00fd67af2a'
API_BASE = 'https://dashboard.cash4code.net/score'
port = 8080
/*
redis = new Redis do
   port: 6379          # Redis port
   host: '127.0.0.1'   # Redis host
   family: 4           # 4 (IPv4) or 6 (IPv6)
   password: 'password'
   db: 0
*/

app = express!

app.use body-parser.json!

MESSAGES = {}

app.get '/', (req, res) ->
   res.send 'Hello!'

app.post '/', (req, res) ->
   console.log "Body: #{JSON.stringify req.body, null, 2}"

   msg-id = req.body.Id
   part-number = req.body.PartNumber
   total-parts = req.body.TotalParts
   data = req.body.Data

   part = MESSAGES."#{msg-id}"

   if part is undefined then
      part = { total-parts: total-parts, parts: [undefined for part in [0 til total-parts]] }
      MESSAGES."#{msg-id}" = part

   part.parts[part-number] = data
   res.send 'OK'

   console.log "#{JSON.stringify part.parts, null, 2}"

   if undefined not in part.parts then
      console.log "Got all parts for #{msg-id}..."

      body = part.parts |> _.Str.join ''
      console.log "Body: #{body}"

      request.post do
         do
            url: API_BASE + '/' + msg-id
            headers:
               "x-gameday-token": API_TOKEN
            body: body
         (err, resp, body) ->
            console.log "Response posted #{err} #{body}"

app.listen port, ->
   console.log "Unicorns app listening on port #{port}"
