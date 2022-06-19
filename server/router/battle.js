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
        var other_user_socket = interact.get_close_player(socket, io, config.ATTACK_DISTANCE, false);
        if(other_user_socket === null) {
            interact.announce(socket.id, io, 'punched thin air', config.SEEING_DISTANCE, false);
            socket.send('You missed');
        } else {
            crud_battle.attack(other_user_socket, damage);
            other_user_socket.send('You got punched!')
        }
    });
}
