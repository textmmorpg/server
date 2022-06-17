const crud_move = require('../crud/move');
const crud_login = require('../crud/login')
const crud_terrain = require('../crud/terrain');

module.exports = {
    add_routes
}

function get_direction(angle) {
    if(angle < Math.PI/6) {
        return 'East';
    } else if(angle < Math.PI/3) {
        return 'North East';
    } else if(angle < (Math.PI*2)/3) {
        return 'North';
    } else if(angle < (Math.PI*5)/6) {
        return 'North West';
    } else if(angle < (Math.PI*7)/6) {
        return 'West';
    } else if(angle < (Math.PI*4)/3) {
        return 'South West';
    } else if(angle < (Math.PI*5)/3) {
        return 'South';
    } else if(angle < (Math.PI*11)/6) {
        return 'South East';
    } else {
        return 'East';
    }
}

function add_routes(socket, io) {

    socket.on('vibe check', function(data) {
        crud_move.get_vibe(socket.id).catch(console.dir).then( (user) => {
        socket.send({
            data: 'You are a ' + user['tall'] + ' ' + user['weight'] + 
            ' ' + user['age'] + ' human. You are currently ' + user['posture'] +
            '. You are facing ' + get_direction(user['angle']) + ', located at ' + user['lat'] +
            ', ' + user['long'] + ', ' + user['height'] + '. You haven\'t done anything since ' + 
            user['last_cmd_ts'] + '. You have ' + user['energy']*100 + '% energy. ' +
            'Your admin status is: ' + user['admin']
        });
        })
    })

    socket.on('look', function(data) {
        crud_login.get_user(socket.id).catch(console.dir).then( (user) => {
            crud_terrain.check_biomes(socket, user);
        });
    })
}