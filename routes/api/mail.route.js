var express = require("express");
var router = express.Router();
var MailController = require("../../controllers/mail.controller");

router.post("/sendMail", MailController.sendMail);

module.exports = router;
