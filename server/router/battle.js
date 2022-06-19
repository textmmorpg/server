const crud_battle = require('../crud/battle');
const crud_user = require('../crud/user');
const announce = require('../announce');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('suicide', function(data) {
        crud_battle.death(socket);
        announce.announce(socket.id, io, 'died', config.SEEING_DISTANCE, false);
        crud_user.respawn(socket);
    });
}
