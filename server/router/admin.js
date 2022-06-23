const crud_user_basic = require('../crud/user/basic');
const crud_admin = require('../crud/admin');
const crud_interact = require('../crud/interact/interact');
const config = require('../config');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('teleport to', function(data) {

        var email_target = data["msg"].replace("teleport to", "").trim();

        // check if current user is admin
        crud_admin.is_admin(socket.id).catch(console.dir).then( (user) => {
            if(!user["admin"]) {
                socket.send({data: "Only admin users can teleport"});
                return;
            }

            // check if target user exists
            crud_user_basic.get_user_by_email(email_target).catch(console.dir).then( (user) => {
                if(user === null) {
                    socket.send({data: "User not found: " + email_target});
                    return;
                }

                // calculate place to teleport (directly in front of the target user)
                var target_lat = config.ONE_METER * Math.cos(user["angle"]);
                var target_long = config.ONE_METER * Math.sin(user["angle"]);
                var target_angle = (user["angle"] + Math.PI) // turn to face them

                // move current user to target user
                crud_admin.teleport(
                    socket, target_lat, target_long, target_angle
                ).catch(console.dir).then( () => {
                    socket.send({data: "Teleport successful"});
                    // announce to players around target user that we teleported
                    crud_interact.announce(socket.id, io, 'teleported', config.SEEING_DISTANCE, true);
                    // look around new environment
                    crud_interact.look_around(socket.id, io);
                });
            });
        });
    })


    socket.on('ban', function(data) {
        var email_target = data["msg"].replace("ban", "").trim();

        // check if current user is admin
        crud_admin.is_admin(socket.id).catch(console.dir).then( (user) => {
            if(!user["admin"]) {
                socket.send({data: "Only admin users can ban people"});
                return;
            }

            // check if target user exists
            crud_user_basic.get_user_by_email(email_target).catch(console.dir).then( (user) => {
                if(user === null) {
                    socket.send({data: "User not found: " + email_target});
                    return;
                }

                crud_admin.ban(email_target, io).catch(console.dir).then( () => {
                    socket.send({data: "User banned"});
                });
            });
        });
    });
}
