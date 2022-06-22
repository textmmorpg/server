const crud_battle = require('../crud/battle');
const crud_user = require('../crud/user/user');
const crud_interact = require('../crud/interact/interact');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('suicide', function(data) {
        socket.send({data: "You have died."});
        crud_battle.create_corpse(socket);
        crud_interact.announce(socket.id, io, 'committed suicide', config.SEEING_DISTANCE, false);
        crud_user.respawn(socket.id, io, 'suicide');
    });

    socket.on('punch', function(data) {
        crud_interact.attack_nearby(
            socket, io, 
            config.ATTACK_DISTANCE,
            config.PUNCH_ENERGY, config.PUNCH_DAMAGE, false
        );
    });
}
