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
    set_posture,
    get_vibe,
    add_connection,
    delete_connection,
    get_other_connections,
    move,
    reset_world,
    add_terrain,
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
    }, {lat: 1, long: 1, socket_id: 1, energy: 1, posture: 1});
}
  
async function check_username(username) {
    return await db.collection('user').count({
        username: username
    });
}

async function create_user(user, pass, socket_id, angle, age, tall, weight) {
    await get_spawn_location().catch(console.dir).then( (spawn) => {
        db.collection('user').insertOne({
            username: user, password: pass,
            lat: spawn["lat"], long: spawn["long"], height: spawn["height"],
            angle: angle, socket_id:socket_id,
            age: age, tall: tall, weight: weight, posture: "standing",
            energy: 1, last_cmd_ts: new Date(),
            last_set_posture_ts: new Date()
        });
    })
}

async function set_posture(socket, posture) {
    // TODO: is it possible to do this in one query?
    await get_user(socket.id).catch(console.dir).then( (user) => {

        if(user['posture'] === posture) {
            socket.send({data: "You are already " + posture});
        }

        var energy_regen = 0;
        if(user['posture'] !== 'standing' && user['energy'] < 1) {
            // captured in milliseconds
            var time_in_posture = new Date() - user["last_set_posture_ts"]
            var regen_multiplier = {
                "sitting": 1,
                "laying": 2
            }[user['posture']]
            // 20 seconds of sitting or 10 seconds of laying to get
            // to full energy
            energy_regen = time_in_posture * 0.00005 * regen_multiplier;
            if(energy_regen + user['energy'] > 1) {
                energy_regen = 1 - user['energy'];
            }
            socket.send(
                {data: "Energy increased by " + 
                Math.round(energy_regen * 100) +
                "% after " + user['posture'] + " for " + 
                parseFloat(time_in_posture/1000).toFixed(1) + " seconds"});
        }

        db.collection('user').updateOne({
            socket_id: socket.id
        }, {
            $set: {
                posture: posture,
                last_cmd_ts: new Date(),
                last_set_posture_ts: new Date(),
            }, $inc: {
                energy: energy_regen
            }
        });
    });
}

async function get_vibe(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {
        age: 1, tall: 1, weight: 1,
        posture: 1, angle: 1, lat: 1, long: 1, height: 1,
        energy: 1
    })
}

async function add_connection(username, socket_id) {
    await db.collection('user').updateOne({
        username: username
    }, {
        $set: {
            socket_id: socket_id,
            last_cmd_ts: new Date()
        }
    });
}

async function delete_connection(socket_id) {
    await db.collection('user').updateMany({
        socket_id: socket_id
    }, {
        $set: {
            socket_id: socket_id,
            last_cmd_ts: new Date()
        }
    });
}

async function get_other_connections(socket_id, x, y, distance) {
    return await db.collection('user').find({
        x: { $gt: x - distance, $lt: x + distance},
        y: { $gt: y - distance, $lt: y + distance},
        socket_id: { $not: { $eq: socket_id }}
    }, {x: 1, y: 1, angle: 1, socket_id: 1});
}

async function move(socket, distance, turn) {
    // convert distance to lat/long degrees
    var move_distance = (Math.PI/100)*distance
    await get_user(socket.id).catch(console.dir).then( (user) => {
        var movement_energy = 0.025 * Math.pow(distance, 2);

        if(user['posture'] === "laying" && turn !== 0) {
            socket.send({data: "You cannot turn around while laying down. Sit or stand up first!"});
            return;
        }

        if(user['energy'] < movement_energy && distance !== 0) {
            socket.send({data: "Not enough energy! Sit or lay down to rest"})
            return;
        }

        if(user['posture'] !== "standing" && distance !== 0) {
            socket.send({data: "Cannot move while " + user['posture'] + '. Stand up first!'})
            return;
        }

        db.collection('user').updateOne({
            socket_id: socket.id
        }, {
            $set: {
                angle: (user["angle"] + turn) % (2 * Math.PI),
                lat: (user["lat"] + move_distance * Math.cos(user["angle"] + turn)) % (2 * Math.PI),
                long: (user["long"] + move_distance * Math.sin(user["angle"] + turn)) % (2 * Math.PI),
                last_cmd_ts: new Date(),
                energy: user["energy"] - movement_energy
            }
        });
    });
}

async function reset_world() {
    await db.collection('world').deleteMany({});
}

async function add_terrain(docs) {
    await db.collection('world').insertMany(docs)
}

async function get_biome(lat, long) {
    lat = (lat+Math.PI*2)%(Math.PI)
    long = (long+Math.PI*2)%(Math.PI*2)
    return await db.collection('world').findOne(
        {
            lat: {$gte: lat, $lte: (lat + (Math.PI+100)/300)},
            long: {$gte: long, $lte: (long + (Math.PI*2+100)/600)}
        }, {height: 1, biome: 1}
    );
}

async function get_spawn_location() {
    return await db.collection('world').findOne(
        {
            biome: "mountain"
        }, {lat: 1, long: 1, height: 1}
    );
}
