

const custom_db = require('../crud/db/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    // write migration here
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    // how to undo the migration here
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('message').updateMany({}, {
        $set: {
            ts: new Date(),
        }
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('message').updateMany({}, {
        $set: {
            ts: new Date(),
        }
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}
