const crud_interact = require('../crud/interact');
const crud_move = require('../crud/move');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {

    // turning left

    socket.on('turn slight left', function(data) {
        crud_move.move(socket, io, 0, Math.PI/6, 'turn', false);
        interact.announce(socket.id, io, 'turned slight left', config.SEEING_DISTANCE, true);
    });

    socket.on('turn left', function(data) {
        crud_move.move(socket, io, 0, Math.PI/3, 'turn', false);
        interact.announce(socket.id, io, 'turned left', config.SEEING_DISTANCE, true);
    });

    socket.on('turn hard left', function(data) {
        crud_move.move(socket, io, 0, Math.PI/2, 'turn', false);
        interact.announce(socket.id, io, 'turned hard left', config.SEEING_DISTANCE, true);
    });

    socket.on('turn a little to the left', function(data) {
        crud_move.move(socket, io, 0, Math.PI/6 * Math.random(), 'turn', false);
        interact.announce(socket.id, io, 'turned a bit to the left', config.SEEING_DISTANCE, true);

    });

    // turning right

    socket.on('turn slight right', function(data) {
        crud_move.move(socket, io, 0, Math.PI/6 * -1, 'turn', false);
        interact.announce(socket.id, io, 'turned slight right', config.SEEING_DISTANCE, true);
    });

    socket.on('turn right', function(data) {
        crud_move.move(socket, io, 0, Math.PI/3 * -1, 'turn', false);
        interact.announce(socket.id, io, 'turned right', config.SEEING_DISTANCE, true);
    });

    socket.on('turn hard right', function(data) {
        crud_move.move(socket, io, 0, Math.PI/2 * -1, 'turn', false);
        interact.announce(socket.id, io, 'turned hard right', config.SEEING_DISTANCE, true);
    });

    socket.on('turn around', function(data) {
        crud_move.move(socket, io, 0, Math.PI, 'turn', false);
        interact.announce(socket.id, io, 'turned around', config.SEEING_DISTANCE, true);
    });

    socket.on('turn a little to the right', function(data) {
        crud_move.move(socket, io, 0, Math.PI/6 * Math.random() * -1, 'turn', false);
        interact.announce(socket.id, io, 'turned a bit to the right', config.SEEING_DISTANCE, true);
    });

    // face a cardinal direction

    socket.on('turn to face north', function(data) {
        crud_move.move(socket, io, 0, config.NORTH, 'turn', true);
        interact.announce(socket.id, io, 'turned to face north', config.SEEING_DISTANCE, true);
    });

    socket.on('turn to face south', function(data) {
        crud_move.move(socket, io, 0, config.SOUTH, 'turn', true);
        interact.announce(socket.id, io, 'turned to face south', config.SEEING_DISTANCE, true);
    });

    socket.on('turn to face east', function(data) {
        crud_move.move(socket, io, 0, config.EAST, 'turn', true);
        interact.announce(socket.id, io, 'turned to face east', config.SEEING_DISTANCE, true);
    });

    socket.on('turn to face west', function(data) {
        crud_move.move(socket, io, 0, config.WEST, 'turn', true);
        interact.announce(socket.id, io, 'turned to face west', config.SEEING_DISTANCE, true);
    });
}
