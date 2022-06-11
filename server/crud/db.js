const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost/project_title_here_db"
const mongo = new MongoClient(uri,
    {useUnifiedTopology: true}, {useNewUrlParser: true },
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
