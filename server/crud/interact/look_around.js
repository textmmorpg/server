const crud_user_basic = require('../user/basic');
const crud_connection = require('../user/connection');
const crud_terrain = require('../terrain');
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
            // if(is_close()) {

            // }
        });

        // display corpses nearby
    });
}
