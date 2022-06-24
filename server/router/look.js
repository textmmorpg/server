const crud_move = require('../crud/move');
const crud_interact = require('../crud/interact/interact');

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
                '. You are facing ' + get_direction(user['angle']) + ', located at (lat:' + user['lat'] +
                ', long:' + user['long'] + '). You haven\'t done anything since ' + 
                user['last_cmd_ts'] + '. You have ' + Math.round(user['energy']*100) + '% energy. ' +
                'You have ' + Math.round(user['health']*100) + '% health. ' +
                'Your admin status is: ' + user['admin']
            });
        })
    })

    socket.on('look', function(data) {
        crud_interact.look_around(socket.id, io);
    })
}
