const db = require('./db').get_db();

module.exports = {
    add_connection,
    delete_connection,
    get_other_connections,
};

async function add_connection(username, socket_id) {
    await db.collection('user').updateOne({
        username: username
    }, {
        $set: {
            socket_id: socket_id,
            last_cmd_ts: new Date()
        }
    });
}

async function delete_connection(socket_id) {
    await db.collection('user').updateMany({
        socket_id: socket_id
    }, {
        $set: {
            socket_id: socket_id,
            last_cmd_ts: new Date()
        }
    });
}

async function get_other_connections(socket_id, x, y, distance) {
    return await db.collection('user').find({
        x: { $gt: x - distance, $lt: x + distance},
        y: { $gt: y - distance, $lt: y + distance},
        socket_id: { $not: { $eq: socket_id }}
    }, {x: 1, y: 1, angle: 1, socket_id: 1});
}
