const express = require('express')
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const cors = require("cors");

const crud_connection = require('./crud/connection');
const routers = [
  require('./router/speak'),
  require('./router/move'),
  require('./router/turn'),
  require('./router/posture')
]

const login = require('./login');
const path = require('path');
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  cors();
  next(); 
})

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

  routers.forEach( (router) => {
    router.add_routes(socket, io)
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
