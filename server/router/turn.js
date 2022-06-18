const announce = require('../announce');
const crud_move = require('../crud/move');
var seeing_distance = 3;

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('turn slight left', function(data) {
        crud_move.move(socket, 0, Math.PI/6, 'turn');
        announce.announce(socket.id, io, 'turned slight left', seeing_distance, true);
    });

    socket.on('turn left', function(data) {
        crud_move.move(socket, 0, Math.PI/3, 'turn');
        announce.announce(socket.id, io, 'turned left', seeing_distance, true);
    });

    socket.on('turn hard left', function(data) {
        crud_move.move(socket, 0, Math.PI/2, 'turn');
        announce.announce(socket.id, io, 'turned hard left', seeing_distance, true);
    });

    socket.on('turn slight right', function(data) {
        crud_move.move(socket, 0, Math.PI/6 * -1, 'turn');
        announce.announce(socket.id, io, 'turned slight right', seeing_distance, true);
    });

    socket.on('turn right', function(data) {
        crud_move.move(socket, 0, Math.PI/3 * -1, 'turn');
        announce.announce(socket.id, io, 'turned right', seeing_distance, true);
    });

    socket.on('turn hard right', function(data) {
        crud_move.move(socket, 0, Math.PI/2 * -1, 'turn');
        announce.announce(socket.id, io, 'turned hard right', seeing_distance, true);
    });

    socket.on('turn around', function(data) {
        crud_move.move(socket, 0, Math.PI, 'turn');
        announce.announce(socket.id, io, 'turned around', seeing_distance, true);
    });
}