const crud_move = require('../crud/move');
const crud_login = require('../crud/login')
const crud_terrain = require('../crud/terrain');

module.exports = {
    add_routes
}

function add_routes(socket, io) {
    socket.on('vibe check', function(data) {
        crud_move.get_vibe(socket.id).catch(console.dir).then( (user) => {
        // TODO: get user North/south/east/west coords instead of the raw angle
        socket.send({
            data: 'You are a ' + user['tall'] + ' ' + user['weight'] + 
            ' ' + user['age'] + ' human. You are currently ' + user['posture'] +
            '. You are at a ' + user['angle'] + ' angle, located at ' + user['lat'] +
            ', ' + user['long'] + ', ' + user['height'] + '. You haven\'t done anything since ' + 
            user['last_cmd_ts'] + '. You have ' + user['energy']*100 + '% energy'
        });
        })
    })

    socket.on('look', function(data) {
        crud_login.get_user(socket.id).catch(console.dir).then( (user) => {
            crud_terrain.check_biomes(socket, user);
        });
    })
}