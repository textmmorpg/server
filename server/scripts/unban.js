// node unban.js <PROD|DEV> <email>
const db = require('../crud/db/custom_db').get_db(process.argv[2]);
const crud_admin = require('../crud/admin');
crud_admin.unban(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
