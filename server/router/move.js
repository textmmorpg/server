const crud_move = require('../crud/move');
const announce = require('../announce');
var seeing_distance = 10;
var walk_speed = 1;
var run_speed = 2;

module.exports = {
    add_routes
}

function add_routes(socket, io) {

    // walking

    socket.on('walk forward', function (data) {
        crud_move.move(socket, walk_speed, 0, 'walk');
        announce.announce(socket.id, io, 'walked forward', seeing_distance, true);
    });

    socket.on('walk left', function (data) {
        crud_move.move(socket, walk_speed, Math.PI/2, 'walk');
        announce.announce(socket.id, io, 'walked left', seeing_distance, true);
    });

    socket.on('walk right', function(data) {
        crud_move.move(socket, walk_speed, Math.PI/2 * -1, 'walk');
        announce.announce(socket.id, io, 'walked right', seeing_distance, true);
    });

    socket.on('run forward', function (data) {
        crud_move.move(socket, run_speed, 0, 'walk');
        announce.announce(socket.id, io, 'ran forward', seeing_distance, true);
    });

    socket.on('run left', function (data) {
        crud_move.move(socket, run_speed, Math.PI/2, 'walk');
        announce.announce(socket.id, io, 'ran left', seeing_distance, true);
    });

    socket.on('run right', function(data) {
        crud_move.move(socket, run_speed, Math.PI/2 * -1, 'walk');
        announce.announce(socket.id, io, 'ran right', seeing_distance, true);
    });

    // swimming

    socket.on('swim forward', function (data) {
        crud_move.move(socket, walk_speed, 0, 'swim');
        announce.announce(socket.id, io, 'swam forward', seeing_distance, true);
    });

    socket.on('swim left', function (data) {
        crud_move.move(socket, walk_speed, Math.PI/2, 'swim');
        announce.announce(socket.id, io, 'swam left', seeing_distance, true);
    });

    socket.on('swim right', function(data) {
        crud_move.move(socket, walk_speed, Math.PI/2 * -1, 'swim');
        announce.announce(socket.id, io, 'swam right', seeing_distance, true);
    });
}
