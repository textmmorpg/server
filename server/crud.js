const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost/project_title_here_db"
const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const db = mongo.db('project_title_here_db');

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
    return await db.collection('user').count({
        username: user, password: pass
    });
}
  
async function get_user(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {x: 1, y: 1, socket_id: 1});
}
  
async function check_username(username) {
    return await db.collection('user').count({
        username: username
    });
}

// TODO: setup auto-increment
async function create_user(user, pass, socket_id, x, y, angle, age, height, weight) {
    await db.collection('user').insertOne({
        username: user, password: pass,
        x: x, y: y, angle: angle, socket_id:socket_id,
        age: age, height: height, weight: weight
    });
}

async function add_connection(user_id, socket_id) {
    await db.collection('user').updateOne({
        user_id: user_id
    }, {
        $set: {socket_id: socket_id}
    });
}

async function delete_connection(socket_id) {
    await db.collection('user').updateMany({
        socket_id: socket_id
    }, {
        $set: {socket_id: socket_id}
    });
}

async function get_other_connections(socket_id, x, y, distance) {
    return await db.collection('user').find({
        x: { $gt: x - distance, $lt: x + distance},
        y: { $gt: y - distance, $lt: y + distance},
        socket_id: { $not: { $eq: socket_id }}
    }, {x: 1, y: 1, angle: 1, socket_id: 1});
}

async function move(socket_id, distance, turn) {
    // TODO: do this in one query instead of getting
    // the user x/y/angle in a second query
    await get_user(socket_id).catch(console.dir).then( (user) => {
        db.collection('user').updateOne({
            socket_id: socket_id
        }, {
            $set: {
                angle: (user["angle"] + turn) % (2 * Math.PI),
                x: user["x"] + distance * Math.cos(user["angle"] + turn),
                y: user["y"] + distance * Math.sin(user["angle"] + turn)
            }
        });
    });
}

async function reset_world() {
    await db.collection('world').deleteMany({});
}

async function add_biome(x, y, width, height, type) {
    await db.collection('world').insertOne({
        x: x, y: y,
        width: width, height: height,
        type: type
    })
}

async function get_biome(x, y) {
    return await db.collection('world').findOne({
        $and: [
            {$expr: {
                $lt: [x, {$sum:["$x", "$width"]}],
            }}, {$expr: {
                $lt: [y, {$sum:["$y", "$height"]}],
            }}, {$expr: {
                $gt: [x, "$x"],
            }}, {$expr: {
                $gt: [y, "$y"]
            }}
        ]
    }, {type: 1});
}
