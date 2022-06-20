const crud_user = require('../crud/user/user');
const crud_user_basic = require('../crud/user/basic');
const crud_connection = require('../crud/user/connection');
const crud_look_around = require('../crud/interact/look_around');
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

function verify_sso(sso_id) {
    // TODO: verify google SSO ID
    // if verify not successful, send failure to client and redo prompt for login
    // otherwise:
    return true;
}

function login(data, io, socket) {

    if(!verify_sso(data["sso_id"])) {
        socket.send({login_success: false});
        return;
    }

    socket.send({login_success: true});

    crud_connection.get_active_user_count().then( (count) => {
        socket.send({active_users: count});
    });

    crud_user.create_user(data["email"], socket).catch(console.dir).then( () => {
        crud_connection.add_connection(data["email"], socket.id).then( () => {
            crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {
                crud_look_around.look_around(socket.id, io, user["angle"], user["lat"], user["long"]);
                crud_patch_notes.get_patch_notes_since_ts(
                    user['last_read_patch_notes']
                ).catch(console.dir).then((patch_notes) => {
                    write_patch_notes(patch_notes, socket);
                });
            });
        });
    });
}
