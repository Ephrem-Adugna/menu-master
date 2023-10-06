var nodemailer = require("nodemailer");
require('dotenv').config();

//-----------------------------------------------------------------------------
 async function sendMail(subject, toEmail, otpText) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "login",
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.GOOGLE_USERNAME,
    to: toEmail,
    subject: subject,
    text: otpText,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent");
      return true;
    }
  });
}
module.exports = {sendMail}