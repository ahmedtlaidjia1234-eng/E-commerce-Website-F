const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { 
    rejectUnauthorized: false
  }
});



// Reusable function to send email
const sendEmail = async (from,to,subject,text,html,ccAllow) => {
  try {
    const info = await transporter.sendMail({
      from: `"My App" <${from}>`, // sender address
     to : to, // recipient
    subject,
    text,
    html,
      cc: ccAllow && from,           // visible copy
  bcc: ccAllow && from,         // hidden copy (to yourself)
    });

    console.log("✅ Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

module.exports = sendEmail;
