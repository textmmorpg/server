const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost/project_title_here_db"
const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const database = mongo.db('project_title_here_db');

module.exports = {
    get_login,
    get_user,
    check_username,
    create_user,
    add_connection,
    delete_connection,
    get_other_connections,
    move,
    reset_world,
    add_biome,
    get_biome
};

async function get_login(user, pass) {
    // TODO: use count instead of find
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

async function get_other_connections(socket_id, loc_x, loc_y, distance) {
    return await database.collection('user').find({
        loc_x: { $gt: loc_x - distance, $lt: loc_x + distance},
        loc_y: { $gt: loc_y - distance, $lt: loc_y + distance},
        socket_id: { $not: { $eq: socket_id }}
    });
}

async function move(socket_id, distance, turn) {
    // TODO: do this in one query instead of getting
    // the user x/y/angle in a second query
    await get_user(socket_id).catch(console.dir).then( (user) => {
        database.collection('user').updateOne({
            socket_id: socket_id
        }, {
            $set: {
                angle: (user["angle"] + turn) % (2 * Math.PI),
                loc_x: user["loc_x"] + distance * Math.cos(user["angle"] + turn),
                loc_y: user["loc_y"] + distance * Math.sin(user["angle"] + turn)
            }
        });
    });
}

async function reset_world() {
    await database.collection('world').deleteMany({});
}

async function add_biome(loc_x, loc_y, width, height, type) {
    await database.collection('world').insertOne({
        loc_x: loc_x, loc_y: loc_y,
        width: width, height: height,
        type: type
    })
}

async function get_biome(x, y) {
    return await database.collection('world').findOne({
        $and: [
            {$expr: {
                $lt: [x, {$sum:["$loc_x", "$width"]}],
            }}, {$expr: {
                $lt: [y, {$sum:["$loc_y", "$height"]}],
            }}, {$expr: {
                $gt: [x, "$loc_x"],
            }}, {$expr: {
                $gt: [y, "$loc_y"]
            }}
        ]
    });
}
