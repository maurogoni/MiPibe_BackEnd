/**ROUTE USER APIs. */
var express = require('express')

var router = express.Router()
var users = require('./api/user.route')
var profiles = require('./api/profile.route')

router.use('/users', users);
router.use('/profiles', profiles);

module.exports = router;
