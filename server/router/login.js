const crud_user = require('../crud/user/user');
const crud_user_basic = require('../crud/user/basic');
const crud_connection = require('../crud/user/connection');
const crud_interact = require('../crud/interact/interact');
const crud_patch_notes = require('../crud/patch_notes');
const { write_patch_notes } = require('./patch_notes');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('login', function(data) {
        login(data, io, socket);
    });
}

function login(data, io, socket) {
    socket.send({login_success: true});

    crud_connection.get_active_user_count().then( (count) => {
        socket.send({active_users: count});
    });

    crud_user.create_user(data["email"], socket).catch(console.dir).then( () => {
        crud_connection.add_connection(data["email"], socket.id).then( () => {
            
crud_interact.look_around(socket.id, io);
            crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {
                crud_patch_notes.get_patch_notes_since_ts(
                    user['last_read_patch_notes']
                ).catch(console.dir).then((patch_notes) => {
                    write_patch_notes(patch_notes, socket);
                });
            });
        });
    });
}
