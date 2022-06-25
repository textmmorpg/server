const db = require('./db/db').get_db();
const email_util = require('../utils/email');
const config = require('../config');

module.exports = {
    email_metrics
}

async function email_metrics() {

    Promise.all([
        total_users_count(),
        mailing_list_count(),
        new_users_count(),
        active_users_count(),
        messages_count(),
        corpse_count()
    ]).then(function(metrics) {
        var metrics = `
            <table>
            <tbody>
            <tr>
            <td>Total Users</td>
            <td>Users on the Mailing List</td>
            <td>New Users This Week</td>
            <td>Active Users This Week</td>
            <td>Messages Sent This Week</td>
            <td>Corpses Created This Week</td>
            </tr>
            <tr>
            <td>`+metrics[0]+`</td>
            <td>`+metrics[1]+`</td>
            <td>`+metrics[2]+`</td>
            <td>`+metrics[3]+`</td>
            <td>`+metrics[4]+`</td>
            <td>`+metrics[5]+`</td>
            </tr>
            </tbody>
            </table>
        `

        email_util.send_email('updates.textmmo@gmail.com', 'Weekly Metrics', metrics);
    });
}

async function mailing_list_count() {
    return await db.collection('user').count({
        mailing_list: true
    });
}

async function active_users_count() {
    return await db.collection('user').count({
        last_cmd_ts: {$gte: new Date(new Date() - config.ONE_WEEK)}
    });
}

async function total_users_count() {
    return await db.collection('user').count({});
}

async function new_users_count() {
    return await db.collection('user').count({
        signup_ts: {$gte: new Date(new Date() - config.ONE_WEEK)}
    });
}

async function messages_count() {
    return await db.collection('message').count({});
}

async function corpse_count() {
    return await db.collection('corpse').count({});
}
