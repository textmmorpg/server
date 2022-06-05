var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crud = require('./crud');

io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  // user currently playing
  socket.on('message', function (data) {
    if(data['msg'] === 'exit') {
      socket.send({data: "bye"});
      socket.close();
    } else {
      console.log('MSG', socket.id, ' saying ', data['msg']);
      // find nearby players and send them the message
      crud.get_user(socket.id).catch(console.dir).then( (user) => {
        crud.get_other_connections(
          socket.id, user["loc_x"], user["loc_y"], 2
        ).catch(console.dir).then( (other_users) => {
          other_users.forEach( (other_user) => {
            io.to(other_user["socket_id"]).emit('message', {data: data['msg']});
          });
        });
      });
    }
  });

  // existing user login
  socket.on('login', function (data) {
    crud.get_login(
      data['username'], data['password']
    ).catch(console.dir).then( (user) => {
      if(user === null) {
        socket.send({login_success: false});
      } else {
        user_id = user['user_id'];
        crud.add_connection(user_id, socket.id).catch(console.dir);
        socket.send({login_success: true});
      }
    });
  });

  socket.on('signup', function (data) {
    console.log('signup successful: ' + socket.id);
    crud.check_username(data["username"]).catch(console.dir).then( (response) => {
      if(response > 0) {
        socket.send({login_success: false});
      } else {
        crud.create_user(data["username"], data["password"]).catch(console.dir);
        socket.send({login_success: true});
      }
    })
  });

  socket.on('disconnect', function(event) {
    crud.delete_connection(socket.id).catch(console.dir);
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
