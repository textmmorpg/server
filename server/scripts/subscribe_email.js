// node subscribe_email.js <PROD|DEV> <email>
const db = require('../crud/db/custom_db').get_db(process.argv[2]);
const user = require('../crud/user/basic');
user.subscribe(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
