const db = require('./db/db').get_db();
const crud_user_basic = require('./user/basic');
const email_util = require('../utils/email');

module.exports = {
    create_admin,
    is_admin,
    ban,
    unban,
    check_banned,
    add_message,
    teleport,
    report,
    email_admins_messages,
    email_admins_reports,
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

async function get_all_admins() {
    return await db.collection('user').find({
        admin: true
    }, {email: 1});
}

async function email_admins_reports() {
    get_reports().catch(console.dir).then( (reports) => {

        var report_data = `
        <table>
        <tbody>
        <tr>
        <td>Reporter</td>
        <td>Reported</td>
        <td>Date</td>
        </tr>
        `
        reports.forEach( (report) => {
            report_data += `
            <tr>
            <td>`+report['reporter']+`</td>
            <td>`+report['reported']+`</td>
            <td>`+report['ts']+`</td>
            </tr>
            `
        }).then( () => {
            report_data += `
            </tbody>
            </table>
            `
            get_all_admins().catch(console.dir).then( (admins) => {
                admins.forEach( (admin) => {
                    email_util.send_email(
                        admin['email'],
                        'Please review reported users',
                        report_data
                    );
                }).then( () => {
                    delete_reports();
                });
            });
        });
    });
}

async function email_admins_messages() {
    get_all_messages().catch(console.dir).then( (messages) => {

        var message_data = `
        <table>
        <tbody>
        <tr>
        <td>Sender</td>
        <td>Message</td>
        <td>Date</td>
        </tr>
        `
        messages.forEach( (message) => {
            message_data += `
            <tr>
            <td>`+message['sender']+`</td>
            <td>`+message['message']+`</td>
            <td>`+message['ts']+`</td>
            </tr>
            `
        }).then( () => {
            message_data += `
            </tbody>
            </table>
            `

            get_all_admins().catch(console.dir).then( (admins) => {
                admins.forEach( (admin) => {
                    email_util.send_email(
                        admin['email'],
                        'Please review in game messages',
                        message_data
                    );
                }).then( () => {
                    delete_messages();
                });
            });
        })
    })
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

        // email the banned user to inform them they are banned
        email_util.send_email(
            email, 'You are banned',
            'You are banned from textmmo.com indefinitely. Bye!'
        );
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

async function get_all_messages() {
    return await db.collection('message').find({}, {
        sender: 1, message: 1, ts: 1
    });
}

async function delete_messages() {
    await db.collection('message').deleteMany({});
}

// todo: send email to admins for each report with that users
// recent messages
async function report(email_reporter, email_reported) {
    await db.collection('report').insertOne({
        reporter: email_reporter,
        reported: email_reported,
        ts: new Date()
    })
}

async function get_reports() {
    return await db.collection('report').find({});
}

async function delete_reports() {
    await db.collection('report').deleteMany({});
}
