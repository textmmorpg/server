var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  socket.on('message', function (data) {
    if(data['msg'] === 'exit') {
      socket.send({data: "bye"});
      socket.close();
    } else {
      console.log('MSG', socket.id, ' saying ', data['msg']);
      socket.send({data: "I hear you"});
    }
  });

  socket.on('login', function (data) {
    console.log('login successful: ' + socket.id)
    socket.send({login_success: true})
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
