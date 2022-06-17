const db = require('./db').get_db();
const my_math = require('../math');

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

async function get_locations(lat, long, size) {
    return await db.collection('world').find(
        {
            lat: {$gte: lat, $lte: lat + (Math.PI/300)*size},
            long: {$gte: long, $lte: long + (Math.PI/300)*size}
        }, {height: 1, biome: 1, lat: 1, long: 1}
    ); 
}

async function get_biome(lat, long) {
    return await get_locations(lat, long, 10).catch(console.dir).then( (result) => {
        var exception_ret = {height: -100, biome: "hell", lat: lat, long: long}
        if(result === null) {
            return exception_ret;
        }

        var lowest_distance = 99999;
        var closest_location_i = -1;
        return result.forEach( (location, i) => {
            var cur_distance = my_math.distance(
                [1, location["lat"], location["long"]],
                [1, lat, long]
            );
            if(cur_distance < lowest_distance) {
                lowest_distance = cur_distance;
                closest_location_i = i;
            }
        }).then( () => {
            if(closest_location_i === -1) return exception_ret;
            console.log(result);
            return result[closest_location_i];
        })
    })
}

async function check_biomes(socket, angle, lat, long) {
        
    async function look_at_biome(angle) {
        var move_distance = Math.PI/300
        var cur_lat = (lat + move_distance * Math.cos(angle)) % Math.PI;
        var cur_long = (long + move_distance * Math.sin(angle)) % (2 * Math.PI);
        return await get_biome(cur_lat, cur_long);
    }

    var biome_ahead = look_at_biome(angle);
    var biome_right = look_at_biome(angle - Math.PI/2);
    var biome_left = look_at_biome(angle + Math.PI/2);
    Promise.all([biome_ahead, biome_right, biome_left]).then(function(biomes) {
        get_biome(lat, long).catch(console.dir).then( (result) => {
        socket.send({data: "You are in a " + result['biome'] + ". Ahead of you is " + biomes[0]["biome"] +
        ". To the right you see " + biomes[1]["biome"] + " and to the left there is " + biomes[2]["biome"]});
        });
    });
}
