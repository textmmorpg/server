

const custom_db = require('../crud/db/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    // drop user table
    db.collection('user').count({}).then( (count) => {
        console.log("Before delete user count: " + count);
        db.collection('user').deleteMany({}).then( () => {
            db.collection('user').count({}).then( (count) => {
                console.log("After delete user count: " + count);
                // add primary key
                db.collection("user").createIndex(
                    {"email" : 1}, {unique: true}
                ).catch(console.dir).then( () => {
                    console.log("Done");
                    process.exit(0);
                })
            });
        });
    })
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection("user").dropIndex("email").catch(console.dir).then( () => {
        console.log("Done")
        process.exit(0);
    });
}

