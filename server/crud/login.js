const db = require('./db').get_db();
const crud_terrain = require('./terrain');

module.exports = {
    get_login,
    get_user,
    check_username,
    create_user
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

async function create_user(user, pass, socket, angle, age, tall, weight) {
    await get_spawn_location().catch(console.dir).then( (spawn) => {
        db.collection('user').insertOne({
            username: user, password: pass,
            lat: spawn["lat"], long: spawn["long"], height: spawn["height"],
            angle: angle, socket_id:socket.id,
            age: age, tall: tall, weight: weight, posture: "standing",
            energy: 1, last_cmd_ts: new Date(),
            last_set_posture_ts: new Date(),
            last_read_patch_notes: new Date()
        });

        crud_terrain.check_biomes(socket, angle, spawn["lat"], spawn["long"]);
    })
}

async function get_spawn_location() {
    return await db.collection('world').findOne(
        {
            biome: "forest"
        }, {lat: 1, long: 1, height: 1, biome: 1}
    );
}
