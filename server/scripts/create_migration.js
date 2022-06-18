// node create_migration.js <migration_name>
const fs = require('fs');

var filename = __dirname + '/../migrations/' + new Date().valueOf() + '_' + process.argv[2] + ".js"
var content = `
const db = requrie('./crud/custom_db').get_db(process.argv[2]);

module.exports = {
    up,
    down
}

function up() {
    // write migration here
}

function down() {
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
