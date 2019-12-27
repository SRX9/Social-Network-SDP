const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
var rn = require("random-number");

router.post('/login',(req,res)=>{

    res.send({
        usr:"lola"
    });

});

router.get('/register',(req,res)=>{

    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.password;
    const fullname=req.body.password;
    const country=req.body.country;
    //'https://ipapi.co/json/'

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aquasr9@gmail.com",
        pass: "hanumanrajsrk1999@."
      }
    });

    //token and message generator
    var options = {
      min: 999999,
      max: 9999999,
      integer: true
    };

    const token=rn(options);
    const message="";

    var mailOptions = {
      from: "aquasr9@gmail.com",
      to: "blogphins@outlook.com",
      subject: "Sending Email using Node.js",
      text: "That was easy!"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
});

module.exports = router;