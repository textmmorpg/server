var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crud = require('./crud');
var login = require('./login');
var talk = require('./talk');
var move = require('./move');

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
  socket.on('walk forward', function (data) {move.walk_forward(data, socket)});
  socket.on('walk left', function (data) {move.walk_left(data, socket)});
  socket.on('walk right', function(data) {move.walk_right(data, socket)});
  socket.on('run forward', function (data) {move.run_forward(data, socket)});
  socket.on('run left', function (data) {move.run_left(data, socket)});
  socket.on('run right', function(data) {move.run_right(data, socket)});
  socket.on('turn left', function(data) {move.turn_left(data, socket)});
  socket.on('turn right', function(data) {move.turn_right(data, socket)});
  socket.on('turn around', function(data) {move.turn_around(data, socket)});
  socket.on('login', function(data) {login.login(data, socket)});
  socket.on('signup', function(data) {login.signup(data, socket)});
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
