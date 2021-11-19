let nodemailer = require("nodemailer");

exports.sendMail = async (to, subject, message) => {
  var transporter = nodemailer.createTransport({
    //host: 'svp-02715.fibercorp.local',
    //secure: false,
    port: 25,
    service: "Gmail",
    secure: false,
    auth: {
      user: "mipibeapp@gmail.com", //poner cuenta gmail
      pass: "mipibe123", //contraseña cuenta  IMPORTANTE HABILITAR acceso apps poco seguras google
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Definimos el email
  var mailOptions = {
    from: "mipibeapp@gmail.com",
    to: to,
    subject: subject,
    html: message,
  };
  let info = await transporter.sendMail(mailOptions);
  return info;
};
