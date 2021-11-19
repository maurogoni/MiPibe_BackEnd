const { sendMail } = require("../services/mail.service");

exports.sendMail = async function (req, res, next) {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.message
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "Email must be present" });
  }

  var User = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    message: req.body.message,
  };

  try {
    await sendMail(
      "mipibeapp@gmail.com",
      `CONTACT: ${User.email} [${User.name} ${User.surname}]`,
      User.message
    );
    await sendMail(
      User.email,
      `CONTACT: ${User.email} [${User.name} ${User.surname}]`,
      User.message
    );

    return res.status(200).json({
      status: 200,
      message: "Mensaje enviado",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
