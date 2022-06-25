const db = require('../db/db').get_db();

module.exports = {
    get_user,
    get_user_by_email,
    check_mailing_list,
    unsubscribe
}

async function get_user(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {
        lat: 1, long: 1, socket_id: 1, energy: 1,
        posture: 1, angle: 1, last_read_patch_notes: 1,
        email: 1
    });
}

async function get_user_by_email(email) {
    return await db.collection('user').findOne({
        email: email
    }, {
        lat: 1, long: 1, socket_id: 1, energy: 1,
        posture: 1, angle: 1, last_read_patch_notes: 1
    });
}

async function check_mailing_list(email) {
    return await db.collection('user').findOne({
        email: email
    }, {
        mailing_list: 1, unsubscribe_code: 1
    })
}

async function unsubscribe(email, code) {
    return await db.collection('user').updateOne({
        email: email, unsubscribe_code: code
    }, {
        $set: {mailing_list: false}
    })
}
