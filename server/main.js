const express = require('express')
const app = express();
const cors = require("cors");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var package = require('../package.json');
const path = require('path');
const rateLimit = require('express-rate-limit')
const user = require('./crud/user/basic');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

const routers = [
  require('./router/look'),
  require('./router/speak'),
  require('./router/move'),
  require('./router/turn'),
  require('./router/posture'),
  require('./router/patch_notes'),
  require('./router/battle'),
  require('./router/login'),
  require('./router/admin')
]

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  cors();
  next(); 
})

// setup socket.io routes
io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  routers.forEach( (router) => {
    router.add_routes(socket, io)
  });
});

// serve client template
app.use(express.static(path.join(__dirname, '/../client')));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../client/index.html");
});

// this will be called regularly by a gcloud cron job
app.get("/ttl", (req, res) => {
  res.sendStatus(200);
  console.log("Running TTL");

  // TODO

  // delete old corpses

  // delete old messages in the message table

  // delete old reports
});

app.get("/unsubscribe", (req, res) => {
  user.unsubscribe(req.query.email, req.query.code).catch(console.dir).then( () => {
    res.status(200).send("You have been unsubscribed! Sorry for bothering you. Have a good day :)");
  })
});

app.get("/robots.txt", (req, res) => {
  res.sendFile(__dirname + "/../client/robots.txt");
});

http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('Version: ' + package.version);
});
