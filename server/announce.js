var crud = require('./crud');

module.exports = {
    announce: announce
}

function announce(socket_id, io, message, distance) {
    // get sockets of the close players
    crud.get_user(socket_id).catch(console.dir).then( (user) => {
        crud.get_other_connections(socket_id, user["loc_x"], user["loc_y"], distance)
        .catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            other_users.forEach( (other_user) => {
                io.to(other_user["socket_id"]).emit('message', {
                    data: message
                });
            });
        });
    });
}
