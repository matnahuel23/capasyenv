// utils/email.js
const nodemailer = require('nodemailer');
const config = require('../config/config.js'); 
const userMail = config.userMail;
const passMail = config.passMail;

const transport = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    auth: {
        user: userMail,
        pass: passMail,
    },
    tls: {
        rejectUnauthorized: false // Establece rejectUnauthorized en false para confiar en certificados autofirmados
    }
});


function sendEmail(correo, mensaje) {
  const mailOptions = {
    from: `Ecomerce <${userMail}>`,
    to: `${correo}`,
    subject: 'Compra completada',
    html: `
      <div>
        <h1>Gracias por su compra</h1>
        <p>${mensaje}</p>
      </div>
    `,
    attachments: [],
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}

module.exports = { sendEmail };
