const crud_move = require('../crud/move');
const crud_login = require('../crud/login');
const announce = require('../announce');
var seeing_distance = 3;
var walk_speed = 1;
var run_speed = 2;

module.exports = {
    add_routes
}

function add_routes(socket, io) {

    // walking

    socket.on('walk forward', function (data) {
        crud_move.move(socket, walk_speed, 0, 'walk');
        announce.announce(socket.id, io, 'walked forward', seeing_distance, true);
    });

    socket.on('walk left', function (data) {
        crud_move.move(socket, walk_speed, Math.PI/2, 'walk');
        announce.announce(socket.id, io, 'walked left', seeing_distance, true);
    });

    socket.on('walk right', function(data) {
        crud_move.move(socket, walk_speed, Math.PI/2 * -1, 'walk');
        announce.announce(socket.id, io, 'walked right', seeing_distance, true);
    });

    socket.on('run forward', function (data) {
        crud_move.move(socket, run_speed, 0, 'walk');
        announce.announce(socket.id, io, 'ran forward', seeing_distance, true);
    });

    socket.on('run left', function (data) {
        crud_move.move(socket, run_speed, Math.PI/2, 'walk');
        announce.announce(socket.id, io, 'ran left', seeing_distance, true);
    });

    socket.on('run right', function(data) {
        crud_move.move(socket, run_speed, Math.PI/2 * -1, 'walk');
        announce.announce(socket.id, io, 'ran right', seeing_distance, true);
    });

    // swimming

    socket.on('swim forward', function (data) {
        crud_move.move(socket, walk_speed, 0, 'swim');
        announce.announce(socket.id, io, 'swam forward', seeing_distance, true);
    });

    socket.on('swim left', function (data) {
        crud_move.move(socket, walk_speed, Math.PI/2, 'swim');
        announce.announce(socket.id, io, 'swam left', seeing_distance, true);
    });

    socket.on('swim right', function(data) {
        crud_move.move(socket, walk_speed, Math.PI/2 * -1, 'swim');
        announce.announce(socket.id, io, 'swam right', seeing_distance, true);
    });

    // teleporting (only for admins)
    socket.on('teleport to', function(data) {
        // TODO: cleanup nested callbacks
        var username_target = data["msg"].replace("teleport to", "").trim();

        // check if current user is admin
        crud_login.is_admin(socket.id).catch(console.dir).then( (user) => {
            if(!user["admin"]) {
                socket.send({data: "Only admin users can teleport"});
                return;
            }

            // check if target user exists
            crud_login.get_other_user(username_target).catch(console.dir).then( (user) => {
                if(user === null) {
                    socket.send({data: "User not found: " + username_target});
                    return;
                }

                // move current user to target user
                crud_move.teleport(socket, user["lat"], user["long"], user["height"]).catch(console.dir).then( () => {
                    socket.send({data: "Teleport successful"});
                    // announce to players around target user that we teleported
                    announce.announce(socket.id, io, 'teleported', seeing_distance, true);
                });
            });
        });
    })
}
