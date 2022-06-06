const crud = require('./crud');
const { Vector, VectorConstants } = require("simplevectorsjs");

module.exports = {
    announce: announce
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

function get_user_angle(
        user2_x, user2_y, user2_angle,
        user1_x, user1_y
    ) {
    // check if they are within their line of sight
    var user1and2Vector = new Vector();
    var user2Vector = new Vector();
    user1and2Vector.fromTwoPoints([user2_x, user2_y], [user1_x, user1_y]);
    user2Vector.fromTwoPoints([user2_x, user2_y], [
        user2_x + 1 * Math.cos(user2_angle),
        user2_y + 1 * Math.sin(user2_angle)
    ]);
    return user1and2Vector.angle(user2Vector);
}

function maybe_send_message(user1, user2, distance, check_behind, io, message) {
    // send a message if they can hear/see it
    var field_of_view = 2.35619 // 135 degrees

    var distance_ok = within_distance(
        user1["loc_x"], user1["loc_y"],
        user2["loc_x"], user2["loc_y"], distance
    )
    
    var user_angle = get_user_angle(
        user2["loc_x"], user2["loc_y"], user2["angle"],
        user1["loc_x"], user1["loc_y"]
    )

    // TODO: switch on user_angle to get 'far left', 'left', 'center', 'behind', etc
    var perspective = user_angle + ' degrees to you '

    // TODO: if the other player is faceing towards you or away from you
    // their left and right are switched ("the player in front of you walked left vs right"
    // changes depending on which way that player is facing)
    if (distance_ok && (check_behind || user_angle < field_of_view)) {
        io.to(user2["socket_id"]).emit('message', {
            data: 'The player ' + perspective + message
        });
    }
}

function announce(socket_id, io, message, distance, check_behind) {
    // get sockets of the close players
    crud.get_user(socket_id).catch(console.dir).then( (user) => {
        crud.get_other_connections(
            socket_id, user["loc_x"], user["loc_y"], distance
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            other_users.forEach( (other_user) => {
                maybe_send_message(user, other_user, distance, check_behind, io, message);
            });
        });
    });
}
