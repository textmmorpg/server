var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket){
  console.log('connection');

  socket.on('CH01', function (data) {
    console.log('MSG', data['user'], ' saying ', data['msg']);
    socket.send({data: "I hear you"});
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
