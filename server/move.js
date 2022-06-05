var crud = require('./crud');
var seeing_distance = 10;
var walk_speed = 1
var run_speed = 2


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

function move_forward(socket, io, type, speed, turn) {
    // move the player
    crud.move(socket.id, speed, turn);
    // get sockets of the close players
    crud.get_other_connections(
        socket.id, seeing_distance
    ).catch(console.dir).then( (other_users) => {
        // send the message to the socket of each close player
        other_users.forEach( (other_user) => {
            io.to(other_user["socket_id"]).emit('message', {data: 'player ' + type + ' nearby'});
        });
    });
}

function walk_forward(socket, io) {
    move_forward(socket, io, 'walked', walk_speed, 0);
}

function walk_left(socket, io) {
    move_forward(socket, io, 'walked', walk_speed, Math.PI/2);
}

function walk_right(socket, io) {
    move_forward(socket, io, 'walked', walk_speed, Math.PI/2 * -1);
}

function run_forward(socket, io) {
    move_forward(socket, io, 'ran', run_speed, 0);
}

function run_left(socket, io) {
    move_forward(socket, io, 'run', run_speed, Math.PI/2);
}

function run_right(socket, io) {
    move_forward(socket, io, 'run', run_speed, Math.PI/2 * -1);
}

function turn_left(socket, io) {
    move_forward(socket, io, 'turned', 0, Math.PI/2);
}

function turn_right(socket, io) {
    move_forward(socket, io, 'turned', 0, Math.PI/2 * -1);
}

function turn_around(socket, io) {
    move_forward(socket, io, 'turned', 0, Math.PI);
}
