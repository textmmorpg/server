const express = require('express')
const app = express();
const cors = require("cors");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var package = require('../package.json');
const crud_patch_notes = require('./crud/patch_notes');

const routers = [
  require('./router/look'),
  require('./router/speak'),
  require('./router/move'),
  require('./router/turn'),
  require('./router/posture')
]

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  cors();
  next(); 
})

const login = require('./login');
const path = require('path');

// setup socket.io routes
io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  socket.on('login', function(data) {
    if(!data.reconnection) {
      login.login(data, socket);
    } else {
      login.reconnect(data, socket)
    }
  });
  
  socket.on('exit', function (data) {
    socket.send({data: "bye"});
    socket.close();
  });

  socket.on('check patch notes', function(data) {
    crud_patch_notes.get_recent_patch_notes().catch(console.dir).then( (patch_notes) => {
      var message = ""
      patch_notes.forEach((patch_note) => {
        message += patch_note["ts"] + ": " + patch_note["note"] + ". "
      }).then( () => {
        message += "For the full list of patch notes, check https://github.com/beefy/textmmo/releases"
        socket.send({data: message});
      })
    })
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
