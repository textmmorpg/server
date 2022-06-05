var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crud = require('./crud');
var login = require('./login');
var talk = require('./talk');

io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  socket.on('exit', function (data) {
    socket.send({data: "bye"});
    socket.close();
  });

  socket.on('disconnect', function(event) {
    crud.delete_connection(socket.id).catch(console.dir);
  });

  socket.on('say', function(data) {talk.talk(data, socket)});
  socket.on('introduce', function(data) {talk.introduce(data, socket)})
  socket.on('move forward', function (data) {});
  socket.on('move left', function (data) {});
  socket.on('move right', function(data) {});
  socket.on('login', function(data) {login.login(data, socket)});
  socket.on('signup', function(data) {login.signup(data, socket)});
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
