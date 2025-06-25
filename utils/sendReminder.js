const nodemailer = require('nodemailer');

exports.sendReminderEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can also use SMTP config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  await transporter.sendMail(mailOptions);
};
