
require('dotenv').config();
const user = require('../crud/user/basic');
const nodemailer = require('nodemailer');

module.exports = {
    send_email,
    email_list,
    email_list_2
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

function email_list(recipients, subject, headers_text, headers, table_data, callback) {
    // build table
    var email_table = "<table style=\"border: 1px solid black;\"><tbody><tr style=\"border: 1px solid black;\">";

    // add header row
    for(var header of headers_text) {
        email_table += "<td style=\"border: 1px solid black;\">" + header + "</td>";
    }
    email_table += "</tr>";

    table_data.forEach( (row) => {
        email_table += "<tr style=\"border: 1px solid black;\">";
        for(var header of headers) {
            email_table += "<td style=\"border: 1px solid black;\">" + row[header] + "</td>";
        }
        email_table += "</tr>";
    }).then( () => {
        email_table += `
        </tbody>
        </table>
        `;
    
        // send emails
        recipients.forEach( (user) => {
            send_email(
                user['email'],
                subject,
                email_table
            );
        });
    
        // delete data when finished
        if(callback) callback();
    });
}

function email_list_2(recipients, subject, headers_text, headers, table_data, callback) {
    // build table
    var email_table = "<table style=\"border: 1px solid black;\"><tbody><tr style=\"border: 1px solid black;\">";

    // add header row
    for(var header of headers_text) {
        email_table += "<td style=\"border: 1px solid black;\">" + header + "</td>";
    }
    email_table += "</tr>";

    for(var i = 0; i < table_data.length; i++) {
        email_table += "<tr style=\"border: 1px solid black;\">";
        for(var header of headers) {
            email_table += "<td style=\"border: 1px solid black;\">" + table_data[i][header] + "</td>";
        }
        email_table += "</tr>";
    }

    email_table += `
    </tbody>
    </table>
    `;

    // send emails
    recipients.forEach( (user) => {
        send_email(
            user['email'],
            subject,
            email_table
        );
    });

    // delete data when finished
    if(callback) callback();
}