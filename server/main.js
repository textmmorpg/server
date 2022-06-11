const express = require('express')
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require("cors");
const crud_connection = require('./crud/connection');
const crud_move = require('./crud/move');
const crud_login = require('./crud/login');
const login = require('./login');
const path = require('path');
const announce = require('./announce');
// app.use(cors());
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  cors();
  next(); 
})
var walk_speed = 1
var run_speed = 2
var hearing_distance = 10;
var seeing_distance = 10;

app.use(express.static(path.join(__dirname, 'client')));

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

  socket.on('say', function(data) {
    announce.announce(socket.id, io, data['msg'], hearing_distance, false);
  });

  socket.on('whisper', function(data) {
    announce.announce(socket.id, io, data['msg'], hearing_distance*0.2, false);
  });

  socket.on('yell', function(data) {
    announce.announce(socket.id, io, data['msg'], hearing_distance*5, false);
  });
  
  socket.on('walk forward', function (data) {
    crud_move.move(socket, walk_speed, 0);
    announce.announce(socket.id, io, 'walked forward', seeing_distance, true);
  });

  socket.on('walk left', function (data) {
    crud_move.move(socket, walk_speed, Math.PI/2);
    announce.announce(socket.id, io, 'walked left', seeing_distance, true);
  });

  socket.on('walk right', function(data) {
    crud_move.move(socket, walk_speed, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'walked right', seeing_distance, true);
  });

  socket.on('run forward', function (data) {
    crud_move.move(socket, run_speed, 0);
    announce.announce(socket.id, io, 'ran forward', seeing_distance, true);
  });

  socket.on('run left', function (data) {
    crud_move.move(socket, run_speed, Math.PI/2);
    announce.announce(socket.id, io, 'ran left', seeing_distance, true);
  });

  socket.on('run right', function(data) {
    crud_move.move(socket, run_speed, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'ran right', seeing_distance, true);
  });

  socket.on('turn left', function(data) {
    crud_move.move(socket, 0, Math.PI/2);
    announce.announce(socket.id, io, 'turned left', seeing_distance, true);
  });

  socket.on('turn right', function(data) {
    crud_move.move(socket, 0, Math.PI/2 * -1);
    announce.announce(socket.id, io, 'turned right', seeing_distance, true);
  });

  socket.on('turn around', function(data) {
    crud_move.move(socket, 0, Math.PI);
    announce.announce(socket.id, io, 'turned around', seeing_distance, true);
  });

  socket.on('sit down', function(data) {
    crud_move.set_posture(socket, 'sitting');
    announce.announce(socket.id, io, 'sat down', seeing_distance, true);
  })

  socket.on('lay down', function(data) {
    crud_move.set_posture(socket, 'laying');
    announce.announce(socket.id, io, 'layed down', seeing_distance, true);
  })

  socket.on('stand up', function(data) {
    crud_move.set_posture(socket, 'standing');
    announce.announce(socket.id, io, 'stood up', seeing_distance, true);
  })
  
  socket.on('vibe check', function(data) {
    crud_move.get_vibe(socket.id).catch(console.dir).then( (user) => {
      // TODO: get user North/south/east/west coords instead of the raw angle
      socket.send({
        data: 'You are a ' + user['tall'] + ' ' + user['weight'] + 
        ' ' + user['age'] + ' human. You are currently ' + user['posture'] +
        '. You are at a ' + user['angle'] + ' angle, located at ' + user['lat'] +
        ', ' + user['long'] + ', ' + user['height'] + '. You haven\'t done anything since ' + 
        user['last_cmd_ts'] + '. You have ' + user['energy']*100 + '% energy'
      });
    })
  })

  socket.on('look', function(data) {
    crud.login.get_user(socket.id).catch(console.dir).then( (user) => {
      crud.terrain.check_biomes(socket, user);
    });
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
