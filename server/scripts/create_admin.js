// node create_admin.js DEV|PROD <email>

const crud_user = require('../crud/user/user');
const db = require('../crud/db/custom_db').get_db(process.argv[2]);
crud_user.create_admin(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
