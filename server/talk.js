var crud = require('./crud');

module.exports = {
    talk: talk,
    introduce: introduce
}

function talk(data, socket) {
    // get current user x/y to talk to other players close to them
    crud.get_user(socket.id).catch(console.dir).then( (user) => {
        // get sockets of the close players
        crud.get_other_connections(
            socket.id, user["loc_x"], user["loc_y"], 2
        ).catch(console.dir).then( (other_users) => {
            // send the message to the socket of each close player
            other_users.forEach( (other_user) => {
                io.to(other_user["socket_id"]).emit('message', {data: data['msg']});
            });
        });
    });
}

function introduce(data, socket) {

}
