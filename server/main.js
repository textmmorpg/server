const app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const crud = require('./crud');
const login = require('./login');
const announce = require('./announce');
var walk_speed = 1
var run_speed = 2
var hearing_distance = 10;
var seeing_distance = 10;

io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  socket.on('login', function(data) {
    login.login(data, socket);
  });

  socket.on('signup', function(data) {
    login.signup(data, socket);
  });
  
  socket.on('exit', function (data) {
    socket.send({data: "bye"});
    socket.close();
  });

  socket.on('disconnect', function(event) {
    crud.delete_connection(socket.id).catch(console.dir);
  });

  socket.on('say', function(data) {
    announce.announce(socket.id, io, data['msg'], hearing_distance, false);
  });
  
  socket.on('walk forward', function (data) {
    crud.move(socket.id, walk_speed, 0);
    announce.announce(socket.id, io, 'walked forward', seeing_distance, true);
  });

  socket.on('walk left', function (data) {
    crud.move(socket.id, walk_speed, Math.PI/2);
    announce.announce(socket.id, io, 'walked left', seeing_distance, true);
  });

  socket.on('walk right', function(data) {
    crud.move(socket.id, walk_speed, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'walked right', seeing_distance, true);
  });

  socket.on('run forward', function (data) {
    crud.move(socket.id, run_speed, 0);
    announce.announce(socket.id, io, 'ran forward', seeing_distance, true);
  });

  socket.on('run left', function (data) {
    crud.move(socket.id, run_speed, Math.PI/2);
    announce.announce(socket.id, io, 'ran left', seeing_distance, true);
  });

  socket.on('run right', function(data) {
    crud.move(socket.id, run_speed, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'ran right', seeing_distance, true);
  });
  socket.on('turn left', function(data) {
    crud.move(socket.id, 0, Math.PI/2);
    announce.announce(socket.id, io, 'turned left', seeing_distance, true);
  });
  socket.on('turn right', function(data) {
    crud.move(socket.id, 0, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'turned right', seeing_distance, true);
  });
  socket.on('turn around', function(data) {
    crud.move(socket.id, 0, Math.PI);
    announce.announce(socket.id, io, 'turned around', seeing_distance, true);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
