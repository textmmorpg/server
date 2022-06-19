const crud_user_basic = require('../user/basic');
const crud_connection = require('../user/connection');
const proximity = require('./proximity');
const crud_attack = require('./attack');
const config = require("../../config");

module.exports = {
    announce,
    attack_nearby
}

function maybe_send_message(user1, user2, distance, check_behind, io, message) {
    // send a message if they can hear/see it
    var distance_ok = proximity.within_distance(
        user1["lat"], user1["long"],
        user2["lat"], user2["long"], distance
    )

    if(!distance_ok) {
        // too far away to hear/see the message
        return;
    }
    
    var perspective = proximity.get_perspective(user1, user2);

    if(check_behind && perspective.startsWith("behind you")) {
        // out of field of view so they cannot see it
        return;
    }

    io.to(user2["socket_id"]).emit('message', {
        // TODO: 'You *hear/see* the player to your left etc etc'
        // instead of just 'the player to your left etc etc
        data: 'The player ' + perspective + ' ' + message
    });
}

function announce(socket_id, io, message, distance, check_behind) {
    // get sockets of the close players
    crud_user_basic.get_user(socket_id).catch(console.dir).then( (user) => {
        crud_connection.get_other_connections(
            socket_id, user["lat"], user["long"], config.ONE_METER*distance
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            other_users.forEach( (other_user) => {
                maybe_send_message(user, other_user, config.ONE_METER*distance, check_behind, io, message);
            });
        });
    });
}

function attack_nearby(socket, io, distance, energy, damage, only_in_field_of_view) {
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
            var punched = false
            return other_users.forEach( (other_user) => {
                if(proximity.is_close(user, other_user, config.ONE_METER*distance, only_in_field_of_view)) {
                    crud_attack.perform_attack(socket, io, user, other_user, damage, energy);
                    punched = true;
                    return;
                }
            }).then( () => {
                if(!punched) {
                    announce(socket.id, io, 'punched thin air', config.SEEING_DISTANCE, false);
                    socket.send({data: 'You missed'});
                    return;
                }
            });
        });
    });
}
