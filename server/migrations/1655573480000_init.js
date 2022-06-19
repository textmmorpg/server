
const custom_db = require('../crud/custom_db')

module.exports = {
    up,
    down
}

function up(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.createCollection('user');
    db.createCollection('world');
    db.createCollection('patchnotes');
    db.createCollection('corpse');
}

function down(env) {
    console.log("Running on: " + env);
    const db = custom_db.get_db(env);
    db.dropCollection('user');
    db.dropCollection('world');
    db.dropCollection('patchnotes');
    db.dropCollection('corpse');
}
