const crud = require('./crud');

module.exports = {
    login
}

const ages = ["young", "middle aged", "old"];
const heights = ["short", "average", "tall"];
const weights = ["skinny", "average", "fat"];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}


function login(data, socket) {
    // check if credentials exist / are correct
    crud.get_login(
        data['username'], data['password']
    ).catch(console.dir).then( (user) => {
        if(user === 0) {
            // if the user doesn't exist, try to create one
            signup(data, socket);
        } else {
            // user found -> login successful
            crud.add_connection(data['username'], socket.id).catch(console.dir);
            socket.send({login_success: true});
            socket.send({data: "Welcome back!"})
        }
    });
}

function signup(data, socket) {
    // check if that username already exists
    crud.check_username(data["username"]).catch(console.dir).then( (response) => {
        if(response > 0) {
            // that username already exists -> signup failure
            socket.send({login_success: false});
        } else {
        // username is not taken -> signup success
        // TODO: spawn randomly within spawn zone area created in world generator
        crud.create_user(
            data["username"], data["password"], socket.id,
            0, 0, Math.random() * Math.PI * 2,
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
