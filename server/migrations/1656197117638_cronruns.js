
const custom_db = require('../crud/db/custom_db')
const config = require('../config');

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.createCollection('cron').catch(console.dir).then( () => {
        db.collection('cron').insertOne(
            {"last_run":  new Date(new Date() - config.ONE_WEEK)}
        ).then( () => {
            console.log("done");
            process.exit(0);
        })
    });
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.dropCollection('cron').catch(console.dir).then( () => {
        console.log("done");
        process.exit(0);
    });
}
