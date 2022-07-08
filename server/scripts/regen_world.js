// node regen_world.js DEV|PROD
const db = require('../crud/db/custom_db').get_db(process.argv[2]);

const full_data = require('../../../world/biomes.json');
const data = full_data['data']

db.dropCollection('world')
db.collection('world').insertMany(data).then( () => {
    console.log('done')
    process.exit(0)
})
