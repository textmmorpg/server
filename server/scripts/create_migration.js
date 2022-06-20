// node create_migration.js <migration_name>
const fs = require('fs');

var filename = __dirname + '/../migrations/' + new Date().valueOf() + '_' + process.argv[2] + ".js"
var content = `

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

`;

fs.writeFile(filename, content, err => {
    if (err) {
        console.error(err);
    } else {
        console.log("done");
    }
});
