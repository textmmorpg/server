const crud_user_basic = require('../user/basic');
const crud_connection = require('../user/connection');
const crud_terrain = require('../terrain');
const proximity = require('./proximity');
const config = require('../../config');

module.exports = {
    look_around
}

function look_around(socket_id, io) {
    
    crud_user_basic.get_user(socket_id).catch(console.dir).then( (user) => {
        // display biomes nearby
        crud_terrain.check_biomes(socket_id, io, user["angle"], user["lat"], user["long"]);

        // display other players nearby
        crud_connection.get_other_connections(
            socket_id, user["lat"], user["long"], config.ONE_METER*config.SEEING_DISTANCE
        ).catch(console.dir).then( (other_users) => {
            other_users.forEach( (other_user) => {
                // check if "user" can see "other_user"
                var perspective = proximity.get_perspective(
                    other_user, user, config.ONE_METER*config.SEEING_DISTANCE, true
                );
                if(perspective) {
                    io.to(socket_id).emit('message', {
                        data: 'You see a ' + other_user['tall'] + ' ' + other_user['weight'] + 
                        ' ' + other_user['age'] + ' human ' +  perspective
                    });
                }
            })
        });

        // display corpses nearby
    });
}
