const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "krishnakumar.2201115@srec.ac.in",
    pass: "Nitheesh23&",
  },
});

const mailOptions = {
  from: "krishnakumar.2201115@srec.ac.in",
  to: "morthikrishna2017@gmail.com",
  subject: "Test Email",
  text: "This is a test email.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
