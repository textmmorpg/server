const crud_move = require('../crud/move');
const crud_user = require('../crud/user/user');
const crud_interact = require('../crud/interact/interact');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {

    // walking

    socket.on('walk forward', function (data) {
        crud_move.move(socket, io, config.WALK_SPEED, 0, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked forward', config.SEEING_DISTANCE, true);
    });

    socket.on('walk left', function (data) {
        crud_move.move(socket, io, config.WALK_SPEED, Math.PI/2, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked left', config.SEEING_DISTANCE, true);
    });

    socket.on('walk right', function(data) {
        crud_move.move(socket, io, config.WALK_SPEED, Math.PI/2 * -1, 'walk', false);
        crud_interact.announce(socket.id, io, 'walked right', config.SEEING_DISTANCE, true);
    });

    socket.on('run forward', function (data) {
        crud_move.move(socket, io, config.RUN_SPEED, 0, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran forward', config.SEEING_DISTANCE, true);
    });

    socket.on('run left', function (data) {
        crud_move.move(socket, io, config.RUN_SPEED, Math.PI/2, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran left', config.SEEING_DISTANCE, true);
    });

    socket.on('run right', function(data) {
        crud_move.move(socket, io, config.RUN_SPEED, Math.PI/2 * -1, 'walk', false);
        crud_interact.announce(socket.id, io, 'ran right', config.SEEING_DISTANCE, true);
    });

    // swimming

    socket.on('swim forward', function (data) {
        crud_move.move(socket, io, config.SWIM_SPEED, 0, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam forward', config.SEEING_DISTANCE, true);
    });

    socket.on('swim left', function (data) {
        crud_move.move(socket, io, config.SWIM_SPEED, Math.PI/2, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam left', config.SEEING_DISTANCE, true);
    });

    socket.on('swim right', function(data) {
        crud_move.move(socket, io, config.SWIM_SPEED, Math.PI/2 * -1, 'swim', false);
        crud_interact.announce(socket.id, io, 'swam right', config.SEEING_DISTANCE, true);
    });

    // teleporting (only for admins)
    socket.on('teleport to', function(data) {
        // TODO: cleanup nested callbacks
        // TODO: teleport directly in front of them instead of at their exact location

        var username_target = data["msg"].replace("teleport to", "").trim();

        // check if current user is admin
        crud_user.is_admin(socket.id).catch(console.dir).then( (user) => {
            if(!user["admin"]) {
                socket.send({data: "Only admin users can teleport"});
                return;
            }

            // check if target user exists
            crud_user.get_other_user(username_target).catch(console.dir).then( (user) => {
                if(user === null) {
                    socket.send({data: "User not found: " + username_target});
                    return;
                }

                // move current user to target user
                crud_move.teleport(socket, user["lat"], user["long"], user["height"]).catch(console.dir).then( () => {
                    socket.send({data: "Teleport successful"});
                    // announce to players around target user that we teleported
                    crud_interact.announce(socket.id, io, 'teleported', config.SEEING_DISTANCE, true);
                });
            });
        });
    })
}
