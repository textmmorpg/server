var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { MongoClient } = require("mongodb");

const mongo_uri = "mongodb://localhost/project_title_here_db"

async function get_user_id(user, pass) {
  const mongo = new MongoClient(mongo_uri);
  try {
      await mongo.connect();
      const database = mongo.db('project_title_here_db');
      const user_table = database.collection('user');

      const result = await user_table.findOne({
          username: user, password: pass
      });

      return result;
  } finally {
      await mongo.close();
  }
}

async function add_connection(user_id, socket_id) {
  const mongo = new MongoClient(mongo_uri);
  try {
      await mongo.connect();
      const database = mongo.db('project_title_here_db');
      const connection_table = database.collection('connection');

      await connection_table.deleteOne({
          user_id: user_id
      })

      await connection_table.insertOne({
          user_id: user_id, socket_id: socket_id
      });

  } finally {
      await mongo.close();
  }
}

async function delete_connection(socket_id) {
  const mongo = new MongoClient(mongo_uri);
  try {
      await mongo.connect();
      const database = mongo.db('project_title_here_db');
      const connection_table = database.collection('connection');

      await connection_table.deleteMany({
          socket_id: socket_id
      })

  } finally {
      await mongo.close();
  }
}

io.on('connection', function (socket){
  console.log('new connection: ' + socket.id);

  // user currently playing
  socket.on('message', function (data) {
    if(data['msg'] === 'exit') {
      socket.send({data: "bye"});
      socket.close();
    } else {
      console.log('MSG', socket.id, ' saying ', data['msg']);
      socket.send({data: "I hear you"});
    }
  });

  // existing user login
  socket.on('login', function (data) {
    get_user_id(
      data['username'], data['password']
    ).catch(console.dir).then( (user) => {
      if(user === null) {
        socket.send({login_success: false});
      } else {
        user_id = user['user_id'];
        add_connection(user_id, socket.id).catch(console.dir);
        socket.send({login_success: true});
      }
    });
  });

  // new user login
  socket.on('signup', function (data) {
    console.log('signup successful: ' + socket.id);
    socket.send({login_success: true});
  });

  socket.on('disconnect', function(event) {
    delete_connection(socket.id).catch(console.dir);
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
