const db = require('../db/db').get_db();
const crud_interact = require('../interact/interact');

module.exports = {
    create_user,
    respawn,
    respawn_from_email
};

const ages = ["young", "middle aged", "old"];
const heights = ["short", "average", "tall"];
const weights = ["skinny", "average", "fat"];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function create_user(email, socket) {
    var angle = Math.random() * Math.PI * 2;
    await get_spawn_location().catch(console.dir).then( (spawn) => {
        db.collection('user').insertOne({
            email: email,
            lat: spawn["lat"], long: spawn["long"],
            angle: angle,
            socket_id: socket.id,
            age: getRandom(ages), tall: getRandom(heights), weight: getRandom(weights), 
            posture: "standing",
            energy: 1,
            health: 1,
            last_cmd_ts: new Date(),
            last_set_posture_ts: new Date(),
            last_read_patch_notes: new Date(),
            admin: false,
            mailing_list: true,
            banned: false,
            unsubscribe_code: Math.random().toString(36).slice(2),
            signup_ts: new Date(),
        }).catch( (error) => {
            if(error.code === 11000) {
                // duplicate email / returning user
                socket.send({data: "Welcome back!"});
            } else {
                console.error(error);
            }
        });
    })
}

async function respawn(socket_id, io, reason_of_death) {
    // send message to user
    io.to(socket_id).emit('message', {
        data: 'You died from ' + reason_of_death + '. You are respawning'
    });

    // get spawn location
    await get_spawn_location().catch(console.dir).then( (spawn) => {

        // update user location to spawn and reset energy/health
        db.collection('user').updateOne({
            socket_id: socket_id
        }, {
            $set: {
                lat: spawn["lat"], long: spawn["long"],
                energy: 1,
                health: 1,
                last_cmd_ts: new Date(),
                posture: "standing",
                age: getRandom(ages), tall: getRandom(heights), weight: getRandom(weights),
                angle: Math.random() * Math.PI * 2
            }
        }).catch(console.dir).then( () => {

            // look around at the new spawn location
            crud_interact.look_around(socket_id, io);
        });
    });
}

async function respawn_from_email(email) {
    // get spawn location
    await get_spawn_location().catch(console.dir).then( (spawn) => {

        // update user location to spawn and reset energy/health
        db.collection('user').updateOne({
            email: email
        }, {
            $set: {
                lat: spawn["lat"], long: spawn["long"],
                energy: 1,
                health: 1,
                last_cmd_ts: new Date(),
                posture: "standing",
                age: getRandom(ages), tall: getRandom(heights), weight: getRandom(weights),
                angle: Math.random() * Math.PI * 2
            }
        });
    });
}

async function get_spawn_location() {
    return await db.collection('world').find(
        {
            biome: "forest"
        }, {lat: 1, long: 1, height: 1, biome: 1}
    ).limit(1).skip(Math.round(Math.random()*100)).next();
}
