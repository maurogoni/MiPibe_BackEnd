var express = require("express");
var router = express.Router();

/* GET utils listing. */
router.get("/", function (req, res, next) {
  res.send("Utils listing");
});

module.exports = router;
