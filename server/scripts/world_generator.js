const crud = require('../crud/terrain');
const terrain = require('../world/terrain_generator');
const db = require('../crud/db/custom_db').get_db(process.argv[2]);
const config = require('../config');

function biome(height) {
    if(height < 0.3) {
        return "deep water";
    } else if(height < 0.55) {
        return "shallow water";
    } else if(height < 0.6) {
        return "beach";
    } else if(height < 0.8) {
        return "field";
    } else if(height < 0.9) {
        return "forest";
    } else if(height < 0.95) {
        return "mountain";
    } else {
        return "mountain top";
    }
}

async function generate() {
    try {
        console.log("generating terrain");
        var height_map = terrain.generate_terrain();
        terrain.write_to_image(height_map);
        console.log("deleting old world");
        await crud.reset_world();
        console.log("inserting new world");
        var docs = new Array()
        height_map.forEach( (row, long_i) => {
            row.forEach( (value, lat_i) => {
                var long = long_i*config.ONE_METER;
                var lat = lat_i*config.ONE_METER;
                docs.push({
                    lat: lat, long: long, height: height_map[long_i][lat_i],
                    biome: biome(height_map[long_i][lat_i])
                })
            })
        })
        await crud.add_terrain(docs, db).catch(console.dir).then( () => {
            console.log("done");
            process.exit(0);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

generate()
