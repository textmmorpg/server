var crud = require('./crud');
var seeing_distance = 10;
var walk_speed = 1
var run_spped = 2


module.exports = {
    walk_forward: walk_forward,
    walk_left: walk_left,
    walk_right: walk_right,
    run_forward: run_forward,
    run_left: run_left,
    run_right: run_right,
    turn_left: turn_left,
    turn_right: turn_right,
    turn_around: turn_around
}

function walk_forward(data, socket) {
    // move the player
    crud.move(socket.id, walk_speed);
    // get sockets of the close players
    crud.get_other_connections(
        socket.id, seeing_distance
    ).catch(console.dir).then( (other_users) => {
        // send the message to the socket of each close player
        other_users.forEach( (other_user) => {
            io.to(other_user["socket_id"]).emit('message', {data: 'player walked nearby'});
        });
    });
}

function walk_left(data, socket) {

}

function walk_right(data, socket) {

}

function run_forward(data, socket) {

}

function run_left(data, socket) {

}

function run_right(data, socket) {

}

function turn_left(data, socket) {

}

function turn_right(data, socket) {

}

function turn_around(data, socket) {

}
