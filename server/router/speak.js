const announce = require('../announce');
var hearing_distance = 3;

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('say', function(data) {
        announce.announce(socket.id, io, data['msg'], hearing_distance, false);
    });

    socket.on('whisper', function(data) {
        announce.announce(socket.id, io, data['msg'], hearing_distance*0.2, false);
    });

    socket.on('yell', function(data) {
        announce.announce(socket.id, io, data['msg'], hearing_distance*5, false);
    });
}
  