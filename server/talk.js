var crud = require('./crud');
var hearing_distance = 10; 
// TODO: hear faintly if very far away
// TODO: hear with direction (hear from left, from right, etc)

module.exports = {
    talk: talk,
    introduce: introduce
}

function talk(data, socket) {
    // get sockets of the close players
    crud.get_other_connections(
        socket.id, hearing_distance
    ).catch(console.dir).then( (other_users) => {
        // send the message to the socket of each close player
        other_users.forEach( (other_user) => {
            io.to(other_user["socket_id"]).emit('message', {data: data['msg']});
        });
    });
}

function introduce(data, socket) {

}
