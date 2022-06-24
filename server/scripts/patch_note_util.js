// node patch_note.js DEV|PROD <note>
require('dotenv').config();
const nodemailer = require('nodemailer');
const crud_patch_notes = require('../crud/patch_notes');
const db = require('../crud/db/custom_db').get_db(process.argv[2]);
crud_patch_notes.add_patch_note(db, process.argv[3]).catch(console.dir).then( () => {
    console.log("done");
    process.exit(0);
})

// email patch notes
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'updates.textmmo@gmail.com',
      pass: process.env.EMAIL_PASS
    }
});

var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'TextMMO Patch Notes: ' + new Date(),
    text: process.argv[3] +
    "For the full list of patch notes, check https://github.com/beefy/textmmo/releases" + 
    "\n\n\nTo unsubscribe, click [here](https://textmmo.com/unsubscribe?email=project.title.here@gmail.com"

};
  
