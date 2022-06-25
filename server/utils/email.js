
require('dotenv').config();
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'updates.textmmo@gmail.com',
      pass: process.env.EMAIL_PASS
    }
});

function send_email(email, text) {
    var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'TextMMO Patch Notes: ' + new Date(),
        text: process.argv[3] +
        "For the full list of patch notes, check https://github.com/beefy/textmmo/releases" + 
        "\n\n\nTo unsubscribe, click [here](https://textmmo.com/unsubscribe?email=project.title.here@gmail.com"

    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
}
