const announce = require('../announce');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('say', function(data) {
        announce.announce(socket.id, io, data['msg'], config.HEARING_DISTANCE, false);
    });

    socket.on('whisper', function(data) {
        announce.announce(socket.id, io, data['msg'], config.HEARING_DISTANCE_QUIET, false);
    });

    socket.on('yell', function(data) {
        announce.announce(socket.id, io, data['msg'], config.HEARING_DISTANCE_LOUD, false);
    });
}
