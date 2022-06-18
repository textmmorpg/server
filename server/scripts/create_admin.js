// node create_admin.js DEV|PROD <username>

const crud_login = require('../crud/login');
const db = require('../crud/custom_db').get_db(process.argv[2]);
crud_login.create_admin(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
