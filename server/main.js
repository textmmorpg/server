const express = require('express')
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var package = require('../package.json');

const crud_connection = require('./crud/connection');
const routers = [
  require('./router/look'),
  require('./router/speak'),
  require('./router/move'),
  require('./router/turn'),
  require('./router/posture')
]

const login = require('./login');
const path = require('path');

// setup socket.io routes
io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  socket.on('login', function(data) {
    login.login(data, socket);
  });
  
  socket.on('exit', function (data) {
    socket.send({data: "bye"});
    socket.close();
  });

  socket.on('disconnect', function(event) {
    crud_connection.delete_connection(socket.id).catch(console.dir);
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

http.listen(3000, function () {
  console.log('listening on *:3000');
  console.log('Version: ' + package.version);
});
