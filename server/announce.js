var crud = require('./crud');

module.exports = {
    announce: announce
}

function is_visible(user1_x, user1_y, user_angle, user2_x, user2_y) {
    // is user2 visible by user1?
}

function calc_loc_relation(user_x, user_y, user_angle, other_x, other_y) {
    // if you are user_x/y, where is other_x/y in relation to you?
    // to your (far) right? to your (far) left? in front? behind?


}

function announce(socket_id, io, message, distance, visibility_matters) {
    // get sockets of the close players
    crud.get_user(socket_id).catch(console.dir).then( (user) => {
        crud.get_other_connections(
            socket_id, user["loc_x"], user["loc_y"], distance
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            other_users.forEach( (other_user) => {
                io.to(other_user["socket_id"]).emit('message', {
                    data: message
                });
            });
        });
    });
}
