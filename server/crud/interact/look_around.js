const crud_user_basic = require('../user/basic');
const crud_connection = require('../user/connection');
const crud_terrain = require('../terrain');
const proximity = require('./proximity');
const config = require('../../config');

module.exports = {
    look_around
}

function look_around(socket_id, io, angle, lat, long) {
    // display biomes nearby
    crud_terrain.check_biomes(socket_id, io, angle, lat, long);
    
    // display other players nearby
    crud_user_basic.get_user(socket_id).catch(console.dir).then( (user) => {
        crud_connection.get_other_connections(
            socket_id, lat, long, config.SEEING_DISTANCE
        ).catch(console.dir).then( (other_users) => {
            other_users.forEach( (other_user) => {
                if(proximity.is_close(
                    {lat: lat, long: long}, other_user, config.SEEING_DISTANCE, true
                )) {
                    // TODO: add perspective (ex: to the right)
                    io.to(socket_id).emit('message', {
                        data: 'You see a ' + user['tall'] + ' ' + user['weight'] + 
                        ' ' + user['age'] + ' human'
                    });
                }
            })
        });

        // display corpses nearby
    });
}
