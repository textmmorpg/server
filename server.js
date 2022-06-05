var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost/project_title_here_db"

// TODO: move to crud file
async function get_login(user, pass) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  return await database.collection('user').findOne({
      username: user, password: pass
  });
}

async function get_user(socket_id) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  return await database.collection('user').findOne({
      socket_id: socket_id
  });
}

async function check_username(username) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  return await database.collection('user').count({
      username: username
  });
}

// TODO: setup auto-increment
async function create_user(user, pass) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  await database.collection('user').insertOne({
      username: user, password: pass,
      loc_x:0, loc_y:0, angle:0, socket_id:null
  });
}

async function add_connection(user_id, socket_id) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  await database.collection('user').updateOne({
      user_id: user_id
    }, {
      $set: {socket_id: socket_id}
  });
}

async function delete_connection(socket_id) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  await database.collection('user').updateMany({
      socket_id: socket_id
    }, {
      $set: {socket_id: socket_id}
  });
}

async function get_other_connections(socket_id, loc_x, loc_y, distance) {
  const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
  );
  await mongo.connect();
  const database = mongo.db('project_title_here_db');
  return await database.collection('user').find({
      loc_x: { $gt: loc_x - distance, $lt: loc_x + distance},
      loc_y: { $gt: loc_y - distance, $lt: loc_y + distance},
      socket_id: { $not: { $eq: socket_id }}
  });
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
      // find nearby players and send them the message
      get_user(socket.id).catch(console.dir).then( (user) => {
        get_other_connections(
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
    get_login(
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

  // TODO: new user login
  socket.on('signup', function (data) {
    console.log('signup successful: ' + socket.id);
    check_username(data["username"]).catch(console.dir).then( (response) => {
      if(response > 0) {
        socket.send({login_success: false});
      } else {
        create_user(data["username"], data["password"])
        socket.send({login_success: true});
      }
    })
  });

  socket.on('disconnect', function(event) {
    delete_connection(socket.id).catch(console.dir);
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
