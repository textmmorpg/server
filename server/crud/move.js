const db = require('./db').get_db();
const crud_user = require('./user');
const crud_terrain = require('./terrain');
const crud_interact = require('./interact');
const config = require('../config');

module.exports = {
    set_posture,
    get_vibe,
    move,
    teleport
};

async function set_posture(socket, posture) {
    // TODO: is it possible to do this in one query?
    await crud_user.get_user(socket.id).catch(console.dir).then( (user) => {

        if(user['posture'] === posture) {
            socket.send({data: "You are already " + posture});
            return;
        }

        if(
            user['posture'] === "swimming" &&
            (posture === "laying" || posture === "sitting")
        ) {
            socket.send({data: "Cannot sit or lay down while swimming, go to shore first!"})
            return;
        }

        // regen energy when going from sitting/laying to standing
        var energy_regen = 0;
        if(
            (user['posture'] !== 'standing' && user['posture'] !== 'swimming')
            && user['energy'] < 1
        ) {
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

async function check_swimming(socket, user, new_lat, new_long, move_type) {
    var old_biome = crud_terrain.get_biome(user['lat'], user['long']);
    var new_biome = crud_terrain.get_biome(new_lat, new_long);
    return Promise.all([old_biome, new_biome]).then(function(biomes) {
        // check for starting/stopping swimming
        if(
            (biomes[0]["biome"] !== "deep water" && biomes[0]["biome"] !== "shallow water") && 
            (biomes[1]["biome"] === "deep water" || biomes[1]["biome"] === "shallow water")
        ) {
            return "start_swimming";
        } else if(
            (biomes[0]["biome"] === "deep water" || biomes[0]["biome"] === "shallow water") && 
            (biomes[1]["biome"] !== "deep water" && biomes[1]["biome"] !== "shallow water")
        ) {
            return "stop_swimming";
        }

        // check for swimming from water biome to water biome
        if(biomes[1]["biome"] === "deep water" || biomes[1]["biome"] === "shallow water") {
            return "keep_swimming";
        } else {
            return "keep_walking"
        }
    });
}

async function move(socket, io, distance, turn, move_type, set_angle) {
    // convert distance to lat/long degrees
    var move_distance = config.ONE_METER*distance

    // get user data of current position/angle/posture
    await crud_user.get_user(socket.id).catch(console.dir).then( (user) => {

        // calculate some variables based on the type of movement
        var movement_energy = 0.025 * Math.pow(distance, 2); // TODO: move to config
        var new_angle;
        if(!set_angle) {
            new_angle = (user["angle"] + turn) % (2 * Math.PI);
        } else {
            new_angle = turn;
        }
        var new_lat = (user["lat"] + move_distance * Math.cos(user["angle"] + turn)) % (2 * Math.PI);
        var new_long = (user["long"] + move_distance * Math.sin(user["angle"] + turn)) % (2 * Math.PI);

        // prevent user from turning while laying down
        if(user['posture'] === "laying" && turn !== 0) {
            socket.send({data: "You cannot turn around while laying down. Sit or stand up first!"});
            return;
        }

        // check if user is drowning
        if(user['energy'] < movement_energy && distance !== 0 && move_type === "swim") {
            crud_crud_interact.announce(socket.id, io, 'drowned', config.SEEING_DISTANCE, false);
            crud_user.respawn(socket.id, io, 'drowning');
            return;
        }

        // prevent user from moving when they are out of energy
        if(user['energy'] < movement_energy && distance !== 0) {
            socket.send({data: "Not enough energy! Sit or lay down to rest"})
            return;
        }

        // prevent the user from walking unless they are standing
        if(
            (user['posture'] !== "standing" && user['posture'] !== "swimming")
            && distance !== 0
        ) {
            socket.send({data: "Cannot move while " + user['posture'] + '. Stand up first!'})
            return;
        }

        // get swimming status so user does not walk on water or swim on land
        check_swimming(socket, user, new_lat, new_long, move_type).catch(console.dir).then( (swimming_status) => {

            // swimming related checks
            var posture = user["posture"];
            if(swimming_status === "start_swimming") {
                socket.send({data: "You start swimming"});
                posture = "swimming";
            } else if(swimming_status === "stop_swimming") {
                socket.send({data: "You stop swimming"});
                posture = "standing";
            } else if(swimming_status === "keep_swimming" && move_type == "walk") {
                socket.send({data: "You cannot walk in water, swim instead"});
                return;
            } else if(swimming_status === "keep_walking" && move_type == "swim") {
                socket.send({data: "You cannot swim on land, walk or run instead"});
                return;
            }

            // finally if all checks passed, update the needed data
            db.collection('user').updateOne({
                socket_id: socket.id
            }, {
                $set: {
                    angle: new_angle,
                    lat: new_lat,
                    long: new_long,
                    last_cmd_ts: new Date(),
                    energy: user["energy"] - movement_energy,
                    posture: posture
                }
            }).then( () => {
                // afterwards, display the new location info to the user
                crud_terrain.check_biomes(socket.id, io, new_angle, new_lat, new_long);
            })
        })
    });
}

async function teleport(socket, lat, long, height) {
    await db.collection("user").updateOne({
        socket_id: socket.id
    }, {
        $set: {
            lat: lat, long: long, height: height,
            last_cmd_ts: new Date(),
        }
    })
}
