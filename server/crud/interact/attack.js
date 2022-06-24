const db = require('../db/db').get_db();
const crud_spawn = require('../user/spawn');
const crud_user_basic = require('../user/basic');
const crud_connection = require('../user/connection');
const config = require('../../config');
const proximity = require('./proximity');

module.exports = {
    attack_nearby,
    create_corpse
}

function perform_attack(socket, io, user, other_user, damage, energy, perspective) {
    // notify attacker they hit their target
    // TODO: add perspective of the other player
    socket.send({data: 'Your punch hit the player in front of you!'})

    // notify victim they were hit
    io.to(other_user["socket_id"]).emit('message', {
        // TODO: Add perspective of what angle you were hit at ("you were punched from behind")
        data: 'Someone ' + perspective + ' punched you!'
    });

    // TODO: notify player when their health drops too far (ex: "You are close to death")
    // update health of victim and energy of attacker
    attack(
        user, other_user, damage, energy
    ).catch(console.dir).then( () => {
        // check if the attack killed them
        if(other_user["health"] < damage) {
            crud_spawn.respawn(other_user["socket_id"], io, 'a punch')
            // TODO: don't send this to the player that died
            // announce(socket.id, io, 'died from being punched', config.SEEING_DISTANCE, false);
            socket.send({data: 'Your punch was fatal!'});
        }
    });
    
    // TODO: random chance that the attack knocked the player down

    // TODO: announce to other players that the punch landed, but don't notify the victim
    //       because they already know they were hit
}

function attack_nearby(socket, io, distance, energy, damage, check_behind) {
    // TODO: generalize for attacks other than punching
    // TODO: filter out players that are logged off / idle for a long time
    // get sockets of the close players
    crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {

        if(user['energy'] < energy) {
            socket.send({data: "You don't have enough energy to punch! Sit or lay down to reset"});
            return;
        }

        crud_connection.get_other_connections(
            socket.id, user["lat"], user["long"], config.ONE_METER*distance
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            var punched = false;
            return other_users.forEach( (other_user) => {
                // check if "user" can see "other_user"
                var perspective = proximity.get_perspective(
                    other_user, user, config.ONE_METER*distance, check_behind
                );
                if(perspective) {
                    perform_attack(socket, io, user, other_user, damage, energy, perspective);
                    punched = true;
                    return;
                }
            }).then( () => {
                if(!punched) {
                    announce(socket.id, io, 'punched thin air', config.SEEING_DISTANCE, true);
                    socket.send({data: 'You missed'});
                    return;
                }
            });
        });
    });
}

async function create_corpse(socket) {
    await crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {
        db.collection('corpse').insertOne({
            lat: user["lat"], long: user["long"],
            age: user["age"], tall: user["tall"], weight: user["weight"],
            time_of_death: new Date()
        });
    });
}

// reduce health and possibly knock down victim
async function attack(attacker, victim, damage, energy) {
    await db.collection('user').updateOne({
        socket_id: attacker['socket_id']
    }, {
        $set: {energy: attacker['energy'] - energy}
    });

    await db.collection('user').updateOne({
        socket_id: victim['socket_id']
    }, {
        $set: {health: victim['health'] - damage}
    });
}
