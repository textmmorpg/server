const db = require('./db/db').get_db();
const config = require('../config');

module.exports = {
    update_cron_ts,
    last_ran_recently,
};

async function update_cron_ts() {
    await db.collection('cron').updateOne({},{
        $set: {last_run: new Date()}
    });
}

async function last_ran_recently() {
    return await db.collection('cron').findOne({
        last_run: {$lt: new Date(new Date() - config.ALMOST_ONE_WEEK)}
    });
}
