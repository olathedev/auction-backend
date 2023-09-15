const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path');


const sendVerificationMail = async (userEmail, username, verificationCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.MYEMAIL,
          pass: process.env.APP_PASSWORD
        },
      });
    
    //   Load and read the HTML template
    const templatePath = path.join(__dirname, 'emailtemp.html');
    console.log(templatePath)
    const emailTemplate = fs.readFileSync(templatePath, 'utf-8');
    const emailContent = emailTemplate.replace('{{verificationCode}}', verificationCode).replace('{{username}}', username);
    
    
    const mailOptions = {
        from: {name: "Omotola from Auction", address: process.env.MYEMAIL}, // sender address
        to: userEmail, // list of receivers
        subject: "Welcome to auction", // Subject line
        html: emailContent
    }

    const snd = await transporter.sendMail(mailOptions)

    if(!snd){
      throw Error("Oops an error occured, please register again")
    }

    return snd;

}

module.exports = sendVerificationMail