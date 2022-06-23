const crud_interact = require('../crud/interact/interact');
const crud_message = require('../crud/message')
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('say', function(data) {
        var message = data["msg"].replace("say", "").trim()
        crud_interact.announce(socket.id, io, "said \"" + message + "\"", config.HEARING_DISTANCE, false);
        crud_message.add_message(socket, message);
    });

    socket.on('whisper', function(data) {
        var message = data["msg"].replace("whisper", "").trim()
        crud_interact.announce(socket.id, io, "whispered \"" + message + "\"", config.HEARING_DISTANCE_QUIET, false);
        crud_message.add_message(socket, message);
    });

    socket.on('yell', function(data) {
        var message = data["msg"].replace("yell", "").trim()
        crud_interact.announce(socket.id, io, "yelled \"" + message + "\"", config.HEARING_DISTANCE_LOUD, false);
        crud_message.add_message(socket, message);
    });
}
