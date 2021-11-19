var express = require("express");
var router = express.Router();
var UserController = require("../../controllers/users.controller");
var Authorization = require("../../auth/authorization");

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */

router.post("/registration", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/", Authorization, UserController.getUsers);
router.get("/userByMail", Authorization, UserController.getUsersByMail);
router.put("/", Authorization, UserController.updateUser);
router.put("/password", Authorization, UserController.updatePassword);
router.delete("/:user", Authorization, UserController.removeUser);
router.post("/guardarImgUser", UserController.guardarImagenUser);
router.post(
  "/imgUserByMail",
  Authorization,
  UserController.getImagenUserByMail
);
router.post("/forgotPassword", UserController.forgotPassword);
// Export the Router
module.exports = router;

//api/users
//api/users/registration
//api/users/login
