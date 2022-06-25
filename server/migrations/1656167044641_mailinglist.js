
const custom_db = require('../crud/db/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('user').updateMany({}, {
        $set: {
            mailing_list: true,
            unsubscribe_code: Math.random().toString(36).slice(2)
        }
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.collection('user').updateMany({}, {
        $set: {
            mailing_list: null,
            unsubscribe_code: null
        }
    }).then( () => {
        console.log("done");
        process.exit(0);
    })
}
