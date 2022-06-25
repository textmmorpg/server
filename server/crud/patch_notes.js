const db = require('./db/db').get_db();
const email_util = require('../utils/email');
const user = require('./user/basic');
const config = require('../config');

module.exports = {
    add_patch_note,
    get_patch_notes_since_ts,
    get_recent_patch_notes,
    update_user_ts,
    email_patch_notes
};

async function add_patch_note(custom_db, note) {
    await custom_db.collection('patchnotes').insertOne({
        note: note, ts: new Date()
    });
}

async function get_patch_notes_since_ts(ts) {
    return await db.collection('patchnotes').find({
        ts: {$gt: ts}
    });
}

async function get_recent_patch_notes() {
    return await db.collection('patchnotes')
    .find({}).sort({ts: -1}).limit(3);
}

async function update_user_ts(socket_id) {
    await db.collection('user').updateOne({
        socket_id: socket_id
    }, {
        $set: {last_read_patch_notes: new Date()}
    })
}

async function email_patch_notes() {
    var patch_notes = get_patch_notes_since_ts(new Date(new Date() - config.ONE_WEEK));
    var users = user.get_mailing_list();
    patch_notes.then( (patch) => {
        users.then( (user) => {
            email_util.email_list(
                user,
                'Here is what changed on TextMMO',
                ['Patch Note', 'Date'],
                ['note', 'ts'],
                patch,
                false
            );
        })
    })
}
