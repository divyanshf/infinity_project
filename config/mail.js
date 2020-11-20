const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
// const keys = require("./keys");


//authorizing key details for mailGun
const auth = {
    auth: {
        api_key: process.env.MAIL_API_KEY,
        domain: process.env.MAIL_DOMAIN
    }
};


//Receiving mail with the details entered by the user on Contact Page!
const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email, subject, text, cb) => {
    const mailOptions = {
        from: email,
        to: process.env.MAIL_RECEPIENT,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(err, data) {
        if (err)
            cb(err, null);
        else {
            cb(null, data);
        }
    });

}

module.exports = sendMail;