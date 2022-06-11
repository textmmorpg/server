const db = require('./db').get_db();

module.exports = {
    reset_world,
    add_terrain,
    get_biome,
    check_biomes
};

async function reset_world() {
    await db.collection('world').deleteMany({});
}

async function add_terrain(docs) {
    await db.collection('world').insertMany(docs)
}

async function get_biome_attempt(lat, long, size) {
    return await db.collection('world').findOne(
        {
            lat: {$gte: lat, $lte: (lat + (Math.PI/300)*size) % (Math.PI)},
            long: {$gte: long, $lte: (long + (Math.PI/300)*size) % (Math.PI*2)}
        }, {height: 1, biome: 1}
    ); 
}

async function get_biome(lat, long) {
    return await get_biome_attempt(lat, long, 1).catch(console.dir).then( (result) => {
        if(result === null) {
            return get_biome_attempt(lat, long, 2);
        } else {
            return result;
        }
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
