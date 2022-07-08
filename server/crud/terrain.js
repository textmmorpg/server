const db = require('./db/db').get_db();
const config = require('../config');
const sphere_calcs = require('../utils/sphere_calcs');

module.exports = {
    get_biome,
    check_biomes
};

async function get_biome(lat, long) {

    var size = config.ONE_METER;
    var query = sphere_calcs.query_location(lat, long, size);

    return await db.collection('world').findOne(
        {
            $and: query
        }, {height: 1, biome: 1, lat: 1, long: 1}
    ); 
}

async function check_biomes(socket_id, io, angle, lat, long) {
        
    async function look_at_biome(angle) {
        var move_distance = config.ONE_METER
        var cur_lat = (lat + move_distance * Math.cos(angle)) % Math.PI;
        var cur_long = (long + move_distance * Math.sin(angle)) % (2 * Math.PI);
        return await get_biome(cur_lat, cur_long);
    }

    var biome_ahead = look_at_biome(angle);
    var biome_right = look_at_biome(angle - Math.PI/2);
    var biome_left = look_at_biome(angle + Math.PI/2);
    Promise.all([biome_ahead, biome_right, biome_left]).then( (biomes) => {
        get_biome(lat, long).catch(console.dir).then( (result) => {
            console.log(result)
            io.to(socket_id).emit('message', {
                data: "You are in a " + result['biome'] + 
                ". Ahead of you is " + biomes[0]["biome"] +
                ". To the right you see " + biomes[1]["biome"] + 
                " and to the left there is " + biomes[2]["biome"],
                position: {
                    lat: result['lat'],
                    long: result['long'],
                    rotation: 0
                }
            });
        });
    });
}
