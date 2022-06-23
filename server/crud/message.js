const db = require('./db/db').get_db();
const crud_user_basic = require('./user/basic');

module.exports = {
    add_message
}

async function add_message(socket, message) {
    await crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {
        db.collection('message').insertOne({
            sender: user['email'],
            message: message
        });
    });
}
