const db = require('./db/db').get_db();
const crud_user_basic = require('./user/basic');

module.exports = {
    create_admin,
    is_admin,
    ban,
    unban,
    check_banned,
    add_message,
    teleport,
    report
}

async function create_admin(custom_db, email) {
    await custom_db.collection('user').updateOne({
        email: email
    }, {
        $set: {admin: true}
    });
}

async function is_admin(socket_id) {
    return await db.collection('user').findOne({
        socket_id: socket_id
    }, {admin: 1});
}

async function ban(email, io) {
    // set banned to true
    await db.collection('user').updateOne({
        email: email
    }, {
        $set: {banned: true}
    }).catch(console.dir).then( () => {
        // end that users conncetion
        // if they are currently playing
        crud_user_basic.get_user_by_email(email).catch(console.dir).then( (user) => {
            io.in(user['socket_id']).disconnectSockets(true);
        })
    })
}

async function unban(custom_db, email) {
    await custom_db.collection('user').updateOne({
        email: email
    }, {
        $set: {banned: false}
    });
}

async function check_banned(email) {
    return await db.collection('user').findOne({
        email: email
    }, {banned: 1})
}

// teleporting is only available to admins
async function teleport(socket, lat, long, angle) {
    await db.collection("user").updateOne({
        socket_id: socket.id
    }, {
        $set: {
            lat: lat, long: long, angle: angle,
            last_cmd_ts: new Date(),
        }
    })
}

// message records are only used for checking
// which users need to be banned
async function add_message(socket, message) {
    await crud_user_basic.get_user(socket.id).catch(console.dir).then( (user) => {
        db.collection('message').insertOne({
            sender: user['email'],
            message: message,
            ts: new Date()
        });
    });
}

async function report(email_reporter, email_reported) {
    await db.collection('report').insertOne({
        reporter: email_reporter,
        reported: email_reported,
        ts: new Date()
    })
}
