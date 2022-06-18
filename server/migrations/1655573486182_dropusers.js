
const custom_db = require('../crud/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('user').count({}).then( (count) => {
        console.log("Before delete user count: " + count);
        db.collection('user').deleteMany({}).then( () => {
            db.collection('user').count({}).then( (count) => {
                console.log("After delete user count: " + count);
                console.log("Done")
                process.exit(0);
            });
        });
    })
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    // how to undo the migration here
}
