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
        interact.announce(socket.id, io, 'died', config.SEEING_DISTANCE, false);
        crud_user.respawn(socket);
    });

    socket.on('punch', function(data) {
        // TODO: lower energy on punching
        interact.get_close_player(socket, config.ATTACK_DISTANCE, true);
    });
}
