const db = require('./db').get_db();

module.exports = {
    add_patch_note,
    get_patch_notes_since_ts,
    get_recent_patch_notes
};

async function add_patch_note(custom_db, note) {
    await custom_db.collection('patchnotes').insertOne({
        note: note, ts: new Date()
    });
}

async function get_patch_notes_since_ts(ts) {
    return await db.collection('patchnotes').find({
        $gt: {ts: ts}
    });
}

async function get_recent_patch_notes() {
    return await db.collection('patchnotes')
    .find({}).sort({ts: 1}).limit(3);
}
