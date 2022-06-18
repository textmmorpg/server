// node patch_note.js DEV|PROD <note>

const crud_patch_notes = require('../crud/patch_notes');
const db = require('../crud/custom_db').get_db(process.argv[2]);
crud_patch_notes.add_patch_note(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})
