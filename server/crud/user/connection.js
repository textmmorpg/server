const db = require('../db/db').get_db();
const sphere_calcs = require('../../utils/sphere_calcs');

module.exports = {
    add_connection,
    get_other_connections,
    get_active_user_count
};

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

    return await db.collection('user').find({
        $and: sphere_calcs.query_location(x, y, distance),
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
