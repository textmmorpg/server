const db = require('./db').get_db();
const crud_terrain = require('./terrain');

module.exports = {
    get_login,
    get_user,
    check_username,
    create_user,
    create_admin,
    get_other_user,
    is_admin,
    respawn
};

const ages = ["young", "middle aged", "old"];
const heights = ["short", "average", "tall"];
const weights = ["skinny", "average", "fat"];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}


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

async function is_admin(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {admin: 1});
}

async function get_other_user(username) {
    return await db.collection('user').findOne({
        username: username
    }, {lat: 1, long: 1, height: 1});
}

async function check_username(username) {
    return await db.collection('user').count({
        username: username
    });
}

async function create_user(user, pass, socket, angle) {
    await get_spawn_location().catch(console.dir).then( (spawn) => {
        db.collection('user').insertOne({
            username: user, password: pass,
            lat: spawn["lat"], long: spawn["long"], height: spawn["height"],
            angle: Math.random() * Math.PI * 2, socket_id:socket.id,
            age: getRandom(ages), tall: getRandom(heights), weight: getRandom(weights), 
            posture: "standing", energy: 1, last_cmd_ts: new Date(),
            last_set_posture_ts: new Date(),
            last_read_patch_notes: new Date(), admin: false
        }).catch(console.dir).then( () => {
            crud_terrain.check_biomes(socket, angle, spawn["lat"], spawn["long"]);
        });
    })
}

async function respawn(socket) {
    socket.send({data: "Respawning"});
    var angle = Math.random() * Math.PI * 2
    await get_spawn_location().catch(console.dir).then( (spawn) => {
        db.collection('user').updateOne({
            socket_id: socket.id
        }, {
            $set: {
                lat: spawn["lat"], long: spawn["long"], height: spawn["height"],
                energy: 1, last_cmd_ts: new Date(), posture: "standing",
                age: getRandom(ages), tall: getRandom(heights), weight: getRandom(weights),
                angle: angle
            }
        }).catch(console.dir).then( () => {
            crud_terrain.check_biomes(socket, angle, spawn["lat"], spawn["long"]);
        });
    });
}

async function create_admin(custom_db, user) {
    await custom_db.collection('user').updateOne({
        username: user
    }, {
        $set: {admin: true}
    });
}

async function get_spawn_location() {
    return await db.collection('world').find(
        {
            biome: "forest"
        }, {lat: 1, long: 1, height: 1, biome: 1}
    ).limit(1).skip(Math.round(Math.random()*50)).next();
}
