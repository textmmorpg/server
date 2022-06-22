const crud_move = require('../crud/move');
const crud_user = require('../crud/user/user');
const crud_interact = require('../crud/interact/interact');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {

    // walking

    socket.on('walk forward', function (data) {
        crud_move.move(socket, io, config.WALK_SPEED, 0, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked forward', config.SEEING_DISTANCE, true);
    });

    socket.on('walk left', function (data) {
        crud_move.move(socket, io, config.WALK_SPEED, Math.PI/2, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked left', config.SEEING_DISTANCE, true);
    });

    socket.on('walk right', function(data) {
        crud_move.move(socket, io, config.WALK_SPEED, Math.PI/2 * -1, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked right', config.SEEING_DISTANCE, true);
    });

    socket.on('run forward', function (data) {
        crud_move.move(socket, io, config.RUN_SPEED, 0, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran forward', config.SEEING_DISTANCE, true);
    });

    socket.on('run left', function (data) {
        crud_move.move(socket, io, config.RUN_SPEED, Math.PI/2, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran left', config.SEEING_DISTANCE, true);
    });

    socket.on('run right', function(data) {
        crud_move.move(socket, io, config.RUN_SPEED, Math.PI/2 * -1, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran right', config.SEEING_DISTANCE, true);
    });

    // swimming

    socket.on('swim forward', function (data) {
        crud_move.move(socket, io, config.SWIM_SPEED, 0, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam forward', config.SEEING_DISTANCE, true);
    });

    socket.on('swim left', function (data) {
        crud_move.move(socket, io, config.SWIM_SPEED, Math.PI/2, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam left', config.SEEING_DISTANCE, true);
    });

    socket.on('swim right', function(data) {
        crud_move.move(socket, io, config.SWIM_SPEED, Math.PI/2 * -1, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam right', config.SEEING_DISTANCE, true);
    });
}
