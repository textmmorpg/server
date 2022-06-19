const crud_user = require('./crud/user');
const crud_connection = require('./crud/connection');
const crud_battle = require('./crud/battle');
const config = require("./config");
const { Vector, VectorConstants } = require("simplevectorsjs");

module.exports = {
    announce,
    get_close_player
}

function within_distance(
        user1_x, user1_y,
        user2_x, user2_y, distance_limit
    ) {
    // check if they are too far away
    var distance = Math.sqrt(
        Math.pow(user2_x - user1_x, 2) +
        Math.pow(user2_y - user1_y, 2)
    );

    return distance < distance_limit
}

function get_user_vectors(
        user2_x, user2_y, user2_angle,
        user1_x, user1_y
    ) {
    var user1and2Vector = new Vector();
    var user2Vector = new Vector();
    user1and2Vector.fromTwoPoints([user2_x, user2_y, 0], [user1_x, user1_y, 0]);
    user2Vector.fromTwoPoints([user2_x, user2_y, 0], [
        user2_x + 1 * Math.cos(user2_angle),
        user2_y + 1 * Math.sin(user2_angle),
        0
    ]);
    return [user1and2Vector, user2Vector];
}

function is_close(user1, user2, distance, only_in_field_of_view) {
    // send a message if they can hear/see it
    var distance_ok = within_distance(
        user1["lat"], user1["long"],
        user2["lat"], user2["long"], distance
    )

    if(!distance_ok) {
        // too far away to hear/see the message
        return false;
    }
    
    var user_vectors = get_user_vectors(
        user2["lat"], user2["long"], user2["angle"],
        user1["lat"], user1["long"]
    )

    var user_angle = user_vectors[0].angle(user_vectors[1]) % Math.PI;
    var in_field_of_view = user_angle < config.FIELD_OF_VIEW/2
    return !only_in_field_of_view || in_field_of_view;
}

function maybe_send_message(user1, user2, distance, check_behind, io, message) {
    // send a message if they can hear/see it
    var distance_ok = within_distance(
        user1["lat"], user1["long"],
        user2["lat"], user2["long"], distance
    )

    if(!distance_ok) {
        // too far away to hear/see the message
        return;
    }
    
    var user_vectors = get_user_vectors(
        user2["lat"], user2["long"], user2["angle"],
        user1["lat"], user1["long"]
    )

    var user_angle = user_vectors[0].angle(user_vectors[1]) % Math.PI;

    if(check_behind && user_angle > config.FIELD_OF_VIEW) {
        // out of field of view so they cannot see it
        return;
    }

    // TODO: if the other player is faceing towards you or away from you
    // their left and right are switched ("the player in front of you walked left vs right"
    // changes depending on which way that player is facing)
    var direction_vector = user_vectors[0].cross(user_vectors[1]);
    // TODO: replace this vector library / do the math with only Math utils
    var cross_product_values = direction_vector.toString();
    var is_left =  cross_product_values[2] < 0;
    var direction_str = is_left? 'left': 'right';
    var perspective;
    if ( user_angle < Math.PI/10 ) {
        perspective = 'in front of you';
    } else if ( user_angle < Math.PI/4 ) {
        perspective = 'to the ' + direction_str + ' of you';
    } else if ( user_angle < config.FIELD_OF_VIEW/2 ) {
        perspective = 'to the far ' + direction_str + ' of you';
    } else if ( user_angle < (3*Math.PI)/4 ) {
        perspective = 'behind you to the ' + direction_str;
    } else {
        perspective = 'behind you'
    }

    io.to(user2["socket_id"]).emit('message', {
        // TODO: 'You *hear/see* the player to your left etc etc'
        // instead of just 'the player to your left etc etc
        data: 'The player ' + perspective + ' ' + message
    });
}

function announce(socket_id, io, message, distance, check_behind) {
    // get sockets of the close players
    crud_user.get_user(socket_id).catch(console.dir).then( (user) => {
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

function get_close_player(socket, io, distance, only_in_field_of_view) {
    // TODO: generalize for attacks other than punching
    // TODO: filter out players that are logged off / idle for a long time
    // get sockets of the close players
    return crud_user.get_user(socket.id).catch(console.dir).then( (user) => {

        if(user['energy'] < config.PUNCH_ENERGY) {
            socket.send({data: "You don't have enough energy to punch! Sit or lay down to reset"});
            return;
        }

        crud_connection.get_other_connections(
            socket.id, user["lat"], user["long"], config.ONE_METER*distance
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            var punched = false
            return other_users.forEach( (other_user) => {
                if(is_close(user, other_user, config.ONE_METER*distance, only_in_field_of_view)) {
                    // notify attacker they hit their target
                    socket.send({data: 'Your punch hit the player in front of you!'})
                    // notify victim they were hit
                    io.to(other_user["socket_id"]).emit('message', {
                        // TODO: 'You *hear/see* the player to your left etc etc'
                        // instead of just 'the player to your left etc etc
                        data: 'You got punched!'
                    });
                    // check if the attack killed them
                    if(other_user["health"] < config.PUNCH_DAMAGE) {
                        // TODO: update respawn and check biome to use io instead of
                        //       socket object to send messages so we can reuse them here
                        // crud_user.respawn(other_user["socket_id"])
                        socket.send({data: 'The punch was fatal!'});
                    }
                    // update health of victim and energy of attacker
                    crud_battle.attack(
                        user, other_user,
                        config.PUNCH_DAMAGE, config.PUNCH_ENERGY
                    );
                    // TODO: announce to other players that the punch landed, but don't notify the victim
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
