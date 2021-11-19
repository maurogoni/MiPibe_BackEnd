/**ROUTE USER APIs. */
var express = require("express");

var router = express.Router();
var users = require("./api/user.route");
var profiles = require("./api/profile.route");
var mail = require("./api/mail.route");

router.use("/users", users);
router.use("/profiles", profiles);
router.use("/mail", mail);

module.exports = router;
