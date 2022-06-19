const crud_battle = require('../crud/battle');
const crud_user = require('../crud/user');
const announce = require('../announce');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('suicide', function(data) {
        socket.send({data: "You have died."});
        crud_battle.create_corpse(socket);
        announce.announce(socket.id, io, 'died', config.SEEING_DISTANCE, false);
        crud_user.respawn(socket);
    });

    socket.on('punch', function(data) {
        crud_battle.attack(socket, damage);
    });
}
