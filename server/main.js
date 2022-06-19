const express = require('express')
const app = express();
const cors = require("cors");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var package = require('../package.json');
const login = require('./login');
const path = require('path');

const routers = [
  require('./router/look'),
  require('./router/speak'),
  require('./router/move'),
  require('./router/turn'),
  require('./router/posture'),
  require('./router/patch_notes'),
  require('./router/battle')
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

  socket.on('login', function(data) {
    if(!data.reconnection) {
      login.login(data, io, socket);
    } else {
      login.reconnect(data, socket)
    }
  });

  routers.forEach( (router) => {
    router.add_routes(socket, io)
  });
});

// serve client template
app.use(express.static(path.join(__dirname, '/../client')));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../client/index.html");
});

app.get("/robots.txt", (req, res) => {
  res.sendFile(__dirname + "/../client/robots.txt");
});

http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('Version: ' + package.version);
});
