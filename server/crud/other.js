module.exports = {
    add_patch_note
};

async function add_patch_note(db, note) {
    await db.collection('patchnotes').insertOne({
        note: note, ts: new Date()
    })
}
