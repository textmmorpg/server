
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

function send_email(email, subject, text) {
    user.check_mailing_list(email).catch(console.dir).then( (user) => {
        if(!user["mailing_list"]) return;

        var mailOptions = {
            from: 'updates.textmmo@gmail.com',
            to: email,
            subject: subject,
            html: text + 
            "<br><br><br>To unsubscribe from all future emails, click <a href='https://textmmo.com/unsubscribe?email="+email+"@gmail.com&code="+user["unsubscribe_code"]+"'>here</a>"
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
