const db = require('../db/db').get_db();

module.exports = {
    add_connection,
    get_other_connections,
    get_active_user_count,
    check_banned
};

async function check_banned(email) {
    return await db.collection('user').findOne({
        email: email
    }, {banned: 1})
}

async function add_connection(email, socket_id) {
    await db.collection('user').updateOne({
        email: email
    }, {
        $set: {
            socket_id: socket_id,
            last_cmd_ts: new Date()
        }
    });
}

async function get_other_connections(socket_id, x, y, distance) {
    // TODO: fix for spherical planet
    return await db.collection('user').find({
        lat: { $gt: x - distance, $lt: x + distance},
        long: { $gt: y - distance, $lt: y + distance},
        socket_id: { $not: { $eq: socket_id }},
        last_cmd_ts: { $gt: new Date( Date.now() - 1000 * 60 )} // last did something a minute ago
    }, {
        lat: 1, long: 1, angle: 1,
        socket_id: 1,
        health: 1, energy: 1,
        age: 1, tall: 1, weight: 1
    });
}

async function get_active_user_count() {
    // get users active in the last minute
    return await db.collection('user').count({
        last_cmd_ts: {$gt: new Date(Date.now() - 1000 * 60)}
    })
}
