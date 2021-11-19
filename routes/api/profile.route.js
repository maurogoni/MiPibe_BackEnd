var express = require("express");
var router = express.Router();
var ProfileController = require("../../controllers/profiles.controller");
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
router.delete("/:dni", Authorization, ProfileController.removeProfile);
router.post("/saveImgProfile", ProfileController.saveImageProfile); //Sube la imagen a la nube y devuelve url + datos
router.post("/addAllergy", ProfileController.addAllergy);
router.post("/addIllness", ProfileController.addIllness);
router.post("/addControl", ProfileController.addControl);
router.post("/addVaccine", ProfileController.addVaccine);

// Export the Router
module.exports = router;
