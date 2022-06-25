const db = require('./db/db').get_db();
const email_util = require('../utils/email');
const config = require('../config');

module.exports = {
    email_metrics
}

async function email_metrics() {

    Promise.all([
        total_users_count(), mailing_list_count(), new_users_count(),
        active_users_count(), messages_count(), corpse_count()
    ]).then( (results) => {
        email_util.email_list_2(
            [{email:'updates.textmmo@gmail.com'}],
            'Weekly Metrics',
            [
                'Total Users', 'Users on the Mailing List', 'New Users This Week',
                'Active Users This Week', 'Messages Sent This Week', 'Corpses Created This Week'
            ],
            [0,1,2,3,4,5],
            [
                {
                    0: results[0],
                    1: results[1],
                    2: results[2],
                    3: results[3],
                    4: results[4],
                    5: results[5]
                }
            ],
            false
        );
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
