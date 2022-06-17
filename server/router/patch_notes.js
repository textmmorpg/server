const crud_patch_notes = require('../crud/patch_notes');

module.exports = {
    add_routes,
    write_patch_notes
}

function add_routes(socket, io) {
    socket.on('check patch notes', function(data) {
        crud_patch_notes.get_recent_patch_notes().catch(console.dir).then( (patch_notes) => {
            write_patch_notes(patch_notes, socket);
        })
    });
}

function write_patch_notes(patch_notes, socket) {
    var message = ""
    patch_notes.forEach((patch_note) => {
        message += patch_note["ts"] + ": " + patch_note["note"] + ". "
    }).then( () => {
        if(message === "") return;
        message = "Patch notes: " + message;
        message += "For the full list of patch notes, check https://github.com/beefy/textmmo/releases"
        socket.send({data: message});
    })
    crud_patch_notes.update_user_ts(socket.id);
}
