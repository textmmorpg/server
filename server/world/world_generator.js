const crud = require('../crud/terrain');
const terrain = require('./terrain_generator');

const { MongoClient } = require("mongodb");

var uri;
if(process.argv[2] === 'PROD') {
    uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.MONGO_URL+"/project_title_here_db"
} else {
    uri = "mongodb://localhost/project_title_here_db"
}
const mongo = new MongoClient(uri,
    {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const db = mongo.db('project_title_here_db');

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
                var long = long_i*(Math.PI/300);
                var lat = lat_i*(Math.PI/300);
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
