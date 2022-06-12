require('dotenv').config();

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@"+process.env.MONGO_URL+"/project_title_here_db"
const mongo = new MongoClient(uri,
    {useNewUrlParser: true },
    {connectTimeoutMS: 30000 }, {keepAlive: 1}
);
mongo.connect();
const db = mongo.db('project_title_here_db');

module.exports = {
    get_db
};

function get_db() {
    return db;
}
