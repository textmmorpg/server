const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
// const uri =
// "mongodb+srv://<user>:<password>@<cluster-url>?retryWrites=true&writeConcern=majority";
// todo: setup user https://stackoverflow.com/questions/38921414/mongodb-what-are-the-default-user-and-password#:~:text=By%20default%20mongodb%20has%20no,option%20%2D%2Dauth%20or%20security.
const uri = "mongodb://localhost/mydb"
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('project_title_here_db');
        const user = db.collection('user');
        const result = await user.findOne({ user_id: 1 });
        console.log(result);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);
