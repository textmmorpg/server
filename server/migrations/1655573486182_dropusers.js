
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
