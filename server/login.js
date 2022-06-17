const crud_login = require('./crud/login');
const crud_connection = require('./crud/connection');
const crud_terrain = require('./crud/terrain');
const crud_patch_notes = require('./crud/patch_notes');
const { write_patch_notes } = require('./router/patch_notes');

module.exports = {
    login,
    reconnect
}

const ages = ["young", "middle aged", "old"];
const heights = ["short", "average", "tall"];
const weights = ["skinny", "average", "fat"];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function login(data, socket) {
    // check if credentials exist / are correct
    crud_login.get_login(
        data['username'], data['password']
    ).catch(console.dir).then( (user_count) => {
        if(user_count === 0) {
            // if the user doesn't exist, try to create one
            signup(data, socket);
        } else {
            // user found -> login successful
            crud_connection.add_connection(data['username'], socket.id).catch(console.dir).then( () => {
                socket.send({login_success: true});
                socket.send({data: "Welcome back!"});
                crud_login.get_user(socket.id).catch(console.dir).then( (user) => {
                    crud_terrain.check_biomes(socket, user["angle"], user["lat"], user["long"]);
                    crud_patch_notes.get_patch_notes_since_ts(user['last_read_patch_notes']).catch(console.dir).then((patch_notes) => {
                        write_patch_notes(patch_notes, socket);
                    })
                });
            });
        }

        crud_connection.get_active_user_count().catch(console.dir).then( (active_user_count) => {
            socket.send({active_users: active_user_count});
        });
    });
}

function signup(data, socket) {
    // check if that username already exists
    crud_login.check_username(data["username"]).catch(console.dir).then( (response) => {
        if(response > 0) {
            // that username already exists -> signup failure
            socket.send({login_success: false});
        } else {
        // username is not taken -> signup success
        crud_login.create_user(
            data["username"], data["password"], socket, Math.random() * Math.PI * 2,
            getRandom(ages), getRandom(heights), getRandom(weights)
        ).catch(console.dir);
        socket.send({login_success: true});
        socket.send({
            data: "You wake up on a strange new planet. " + 
            "You can't remember how you got here, but you feel a sense of urgency and danger. " +
            "You should find food and a source of clean water, find civilization, and survive."});
        }
    })
}

function reconnect(data, socket) {
    // check if credentials exist / are correct
    crud_login.get_login(
        data['username'], data['password']
    ).catch(console.dir).then( (user_count) => {
        // disallow signup on reconnection
        if(user_count === 0) return;

        crud_connection.add_connection(data['username'], socket.id).catch(console.dir);
        socket.send({data: "Reconnected"})

        crud_login.get_user(socket.id).catch(console.dir).then( (user) => {
            crud_patch_notes.get_patch_notes_since_ts(user['last_read_patch_notes']).catch(console.dir).then((patch_notes) => {
                write_patch_notes(patch_notes, socket);
            })
        });
    });
}
