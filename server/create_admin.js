// node create_admin.js DEV|PROD <username>

const { MongoClient } = require("mongodb");
const crud_login = require('./crud/login');

var uri;
if(process.argv[2] === 'PROD') {
    uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.MONGO_URL+"/project_title_here_db"
} else {
    uri = "mongodb://localhost/project_title_here_db"
}
const mongo = new MongoClient(uri,
    {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const db = mongo.db('project_title_here_db');

crud_login.create_admin(process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
