const db = require('../db/db').get_db();

module.exports = {
    get_user
}

async function get_user(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {lat: 1, long: 1, socket_id: 1, energy: 1, posture: 1});
}
