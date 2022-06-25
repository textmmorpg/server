
require('dotenv').config();
const user = require('../crud/user/basic');
const nodemailer = require('nodemailer');

module.exports = {
    send_email
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'updates.textmmo@gmail.com',
      pass: process.env.EMAIL_PASS
    }
});

function send_email(email, text) {
    user.check_mailing_list(email).catch(console.dir).then( (user) => {
        if(!user[mailing_list]) return;

        var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'TextMMO Patch Notes: ' + new Date(),
            text: text + 
            "\n\n\nTo unsubscribe, click [here](https://textmmo.com/unsubscribe?email="+email+"@gmail.com&code="+user["unsubscribe_code"]
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    })
}
