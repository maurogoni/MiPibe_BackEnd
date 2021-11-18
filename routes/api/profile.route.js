var express = require("express");
var router = express.Router();
var ProfileController = require("../../controllers/profiles.controller");
var UploadController = require("../../controllers/upload.controller");
var MailController = require("../../controllers/mail.controller");
var Authorization = require("../../auth/authorization");

// Authorize each API with middleware and map to the Controller Functions
/* GET users listing. */
router.get("/test", function (req, res, next) {
  res.send("Llegaste a la ruta de  api/profile.routes");
});
router.post("/createProfile", Authorization, ProfileController.createProfile);
router.get("/", Authorization, ProfileController.getProfiles);
router.get("/profileByDNI", Authorization, ProfileController.getProfileByDNI);
router.get(
  "/profilesByUser",
  Authorization,
  ProfileController.getProfileByUser
);
router.put("/", Authorization, ProfileController.updateProfile);
router.delete("/:id", Authorization, ProfileController.removeProfile);
router.post("/guardarImgProfile", ProfileController.guardarImagenProfile);
router.post(
  "/imgProfileByMail",
  Authorization,
  ProfileController.getImagenProfileByDNI
);
router.post("/uploadImg", UploadController.uploadFilesImgProfile); //TODO
router.post("/sendMail", MailController.sendEmail);
router.post("/addAllergy", ProfileController.addAllergy);
router.post("/addIllness", ProfileController.addIllness);
router.post("/addControl", ProfileController.addControl);
router.post("/addVaccine", ProfileController.addVaccine);
// Export the Router
module.exports = router;
