const crud_battle = require('../crud/battle');
const crud_user = require('../crud/user');
const interact = require('../interact');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('suicide', function(data) {
        socket.send({data: "You have died."});
        crud_battle.create_corpse(socket);
        interact.announce(socket.id, io, 'committed suicide', config.SEEING_DISTANCE, false);
        crud_user.respawn(socket.id, io, 'suicide');
    });

    socket.on('punch', function(data) {
        interact.attack_nearby(
            socket, io, 
            config.ATTACK_DISTANCE,
            config.PUNCH_ENERGY, config.PUNCH_DAMAGE, true
        );
    });
}
