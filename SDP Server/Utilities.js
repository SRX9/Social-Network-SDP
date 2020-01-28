const nodemailer = require('nodemailer');
emailWelcomeGreet=async (email)=>{

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aquasr9@gmail.com",
            pass: "asdasd"
        }
    });

    var mailOptions = {
        from: "aquasr9@gmail.com",
        to: email,
        subject: "Welcome to AyeFan",
        text: "A very Warm Welcome to AyeFan",
        html:"<h1>Welcome To AyeFan</h1>"
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error,"adsasdasd");
            return false;
        } else {
            return true;
        }
    });
}
emailOrName = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
module.exports = {
    emailWelcomeGreet:emailWelcomeGreet,
    emailOrName:emailOrName
}