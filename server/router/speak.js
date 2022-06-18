const announce = require('../announce');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('say', function(data) {
        var message = data["msg"].replace("say", "").trim()
        announce.announce(socket.id, io, "said \"" + message + "\"", config.HEARING_DISTANCE, false);
    });

    socket.on('whisper', function(data) {
        var message = data["msg"].replace("whisper", "").trim()
        announce.announce(socket.id, io, "whispered \"" + message + "\"", config.HEARING_DISTANCE_QUIET, false);
    });

    socket.on('yell', function(data) {
        var message = data["msg"].replace("yell", "").trim()
        announce.announce(socket.id, io, "yelled \"" + message + "\"", config.HEARING_DISTANCE_LOUD, false);
    });
}
