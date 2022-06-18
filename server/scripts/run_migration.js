// node run_migration.js <migration_name> <up|down> <prod|dev>

const fs = require('fs');
var files = fs.readdirSync(__dirname + '/../migrations/');
var migration_file = files.filter( (filename) => filename.endsWith(process.argv[2] + ".js"));

if(migration_file.length !== 1) {
    console.log("Count not find migration: " + process.argv[2]);
    return;
}

const migration = require("../migrations/" + migration_file[0]);
if(process.argv[3] === "up") {
    migration.up(process.argv[4]);
} else if(process.argv[3] === "down") {
    migrataion.down(process.argv[4]);
} else {
    console.log("Error! Call this script like this: node run_migration.js <migration_name> <up|down> <prod|dev>");
}
