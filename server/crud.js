const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost/project_title_here_db"
const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const database = mongo.db('project_title_here_db');

module.exports = {
    get_login: get_login,
    get_user: get_user,
    check_username: check_username,
    create_user: create_user,
    add_connection: add_connection,
    delete_connection: delete_connection,
    get_other_connections: get_other_connections,
    move: move
};

async function get_login(user, pass) {
    return await database.collection('user').findOne({
        username: user, password: pass
    });
}
  
async function get_user(socket_id) {
    return await database.collection('user').findOne({
        socket_id: socket_id
    });
}
  
async function check_username(username) {
    return await database.collection('user').count({
        username: username
    });
}

// TODO: setup auto-increment
async function create_user(user, pass) {
    await database.collection('user').insertOne({
        username: user, password: pass,
        loc_x:0, loc_y:0, angle:0, socket_id:null
    });
}

async function add_connection(user_id, socket_id) {
    await database.collection('user').updateOne({
        user_id: user_id
    }, {
        $set: {socket_id: socket_id}
    });
}

async function delete_connection(socket_id) {
    await database.collection('user').updateMany({
        socket_id: socket_id
    }, {
        $set: {socket_id: socket_id}
    });
}

async function get_other_connections(socket_id, distance) {
    // TODO: circle radius instead of square
    return await get_user(socket_id).catch(console.dir).then( (user) => {
        return database.collection('user').find({
            loc_x: { $gt: user["loc_x"] - distance, $lt: user["loc_x"] + distance},
            loc_y: { $gt: user["loc_y"] - distance, $lt: user["loc_y"] + distance},
            socket_id: { $not: { $eq: socket_id }}
        });
    });
}


async function move(socket_id, distance, turn) {
    await get_user(socket_id).catch(console.dir).then( (user) => {
        database.collection('user').updateOne({
            socket_id: socket_id
        }, {
            $set: {
                angle: user["angle"] + turn,
                loc_x: user["loc_x"] + distance * Math.cos(user["angle"] + turn),
                loc_y: user["loc_y"] + distance * Math.sin(user["angle"] + turn)
            }
        });
    });
}
