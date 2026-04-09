const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const message = {
    from: '"CanteenQueue Admin" <admin@canteenqueue.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.htmlMessage || options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('\n-----------------------------------------');
  console.log('✉️  EMAIL SENT TO: %s', options.email);
  console.log('🔗 CLICK HERE TO VIEW EMAIL & RESET LINK: \n%s', nodemailer.getTestMessageUrl(info));
  console.log('-----------------------------------------\n');
};

module.exports = sendEmail;
