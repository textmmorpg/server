const crud_move = require('../crud/move');
const announce = require('../announce');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('sit down', function(data) {
        crud_move.set_posture(socket, 'sitting');
        announce.announce(socket.id, io, 'sat down', config.SEEING_DISTANCE, true);
    });

    socket.on('lay down', function(data) {
        crud_move.set_posture(socket, 'laying');
        announce.announce(socket.id, io, 'layed down', config.SEEING_DISTANCE, true);
    });

    socket.on('stand up', function(data) {
        crud_move.set_posture(socket, 'standing');
        announce.announce(socket.id, io, 'stood up', config.SEEING_DISTANCE, true);
    });
}