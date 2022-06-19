const db = require('./db/db').get_db();
const config = require('../config');

module.exports = {
    reset_world,
    add_terrain,
    get_biome,
    check_biomes
};

async function reset_world() {
    await db.collection('world').deleteMany({});
}

async function add_terrain(docs, custom_db) {
    await custom_db.collection('world').insertMany(docs)
}

async function get_biome(lat, long) {

    var size = config.ONE_METER;
    var max_lat = lat + size;
    var min_lat = lat - size;
    var max_long = long + size;
    var min_long = long - size;
  
    var agg_lat = "$and";
    var agg_long = "$and";

    // extra logic for getting biomes looping around the world
    if(max_lat > Math.PI) {
        max_lat -= Math.PI;
        agg_lat = "$or";
    } else if(min_lat < 0) {
        min_lat += Math.PI;
        agg_lat = "$or";
    }

    if(max_long > Math.PI*2) {
        max_long -= Math.PI*2;
        agg_long = "$or";
    } else if(min_long < 0) {
        min_long += Math.PI*2;
        agg_long = "$or";
    }

    return await db.collection('world').findOne(
        {
            $and: [
                {[agg_lat]: [
                    {lat: {$gte: min_lat}},
                    {lat: {$lte: max_lat}},
                ]}, {[agg_long]: [
                    {long: {$gte: min_long}},
                    {long: {$lte: max_long}},
                ]}
            ]
        }, {height: 1, biome: 1}
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
    Promise.all([biome_ahead, biome_right, biome_left]).then(function(biomes) {
        get_biome(lat, long).catch(console.dir).then( (result) => {
            io.to(socket_id).emit('message', {
                data: "You are in a " + result['biome'] + 
                ". Ahead of you is " + biomes[0]["biome"] +
                ". To the right you see " + biomes[1]["biome"] + 
                " and to the left there is " + biomes[2]["biome"]
            });
        });
    });
}
