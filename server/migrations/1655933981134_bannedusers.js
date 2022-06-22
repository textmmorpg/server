

const custom_db = require('../crud/db/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('user').updateMany({}, {
        $set: {banned: false}
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('user').updateMany({}, {
        $set: {banned: null}
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}

