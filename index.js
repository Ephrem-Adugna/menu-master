const express = require('express');
var nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
var cors = require('cors');
app.use(cors());
app.all('/', async (req, res) => {
    var to =req.query.to;
var body = req.query.body;
var subject = req.query.subject;
  if(to && body && subject){
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
        to: to,
        subject: subject,
        text: body,
      };
    
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
            return res.status(200).send({success: true});
        }
      });
    
  }
  else{
    res.status(400).send({success: false})
  }
})
app.listen(process.env.PORT || 5000)