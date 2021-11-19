var ProfileService = require("../services/profile.service");
var Profile = require("../models/Profile.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.createProfile = async function (req, res, next) {
  // Req.Body contains the form submit values.
  console.log("llegue al controller de PROFILE-->", req.body);
  var Profile = {
    name: req.body.name,
    surname: req.body.surname,
    dni: req.body.dni,
    dateBorn: req.body.dateBorn,
    bloodType: req.body.bloodType,
    user: req.body.user,
    publicIdImage: req.body.publicIdImage,
  };

  try {
    // Calling the Service function with the new object from the Request Body
    var createdProfile = await ProfileService.createProfile(Profile);
    if (createdProfile === 0) {
      console.log("Error. Usuario no registrado: ==>>", Profile.user, "<<==");
      var notExistUser = Profile.user;
      return res.status(400).json({
        message: "Error: profile not created, not valid USER:",
        notExistUser,
      });
    } else {
      if (createdProfile === 1) {
        console.log("Error. Perfil no disponible: ==>>", Profile.dni, "<<==");
        var repeatedDNI = Profile.dni;
        return res.status(400).json({
          message: "Error: Profile not disponible, in use.",
          repeatedDNI,
        });
      } else {
        return res
          .status(201)
          .json({ createdProfile, message: "Succesfully Created Profile" });
      }
    }
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "Profile Creation was Unsuccesfull" });
  }
};

// Async Controller function to get the To do List
exports.getProfiles = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 20;
  try {
    var Profiles = await ProfileService.getProfiles({}, page, limit);
    // Return the Profiles list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Profiles,
      message: "Succesfully Profiles Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.getProfileByDNI = async function (req, res, next) {
  console.log(
    "dentro de getProfilebyDNI en profiles.controller--->dni=",
    req.body
  );
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  let filtro = { dni: req.body.dni };

  try {
    var Profiles = await ProfileService.getProfiles(filtro, page, limit);
    // Return the Profiles list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Profiles,
      message: "Succesfully Profiles Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getProfileByUser = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  let filtro = { user: req.query.username };

  //console.log("profiles.conroller.js----> filtro: ",filtro);
  try {
    var Profiles = await ProfileService.getProfiles(filtro, page, limit);
    //console.log("profiles.conroller.js----> Obtiene esto: ",Object.values(Profiles.docs));
    // Return the Profiles list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Profiles,
      message: "Succesfully Profiles Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.updateProfile = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.dni) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var Profile = {
    name: req.body.name,
    surname: req.body.surname,
    dni: req.body.dni,
    bloodType: req.body.bloodType,
    url: req.body.url ? req.body.url : null,
    publicIdImage: req.body.publicIdImage ? req.body.publicIdImage : null,
  };

  console.log("Profile", Profile);
  try {
    var updatedProfile = await ProfileService.updateProfile(Profile);
    return res.status(200).json({
      status: 200,
      data: updatedProfile,
      message: "Succesfully Updated Profile",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.removeProfile = async function (req, res, next) {
  var dni = req.params.dni;
  try {
    var deleted = await ProfileService.deleteProfile(dni);
    res.status(200).send("Succesfully Deleted... ");
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.saveImageProfile = async function (req, res, next) {
  console.log("ImgProfile", req.body);
  // Id is necessary for the update
  if (!req.body.dni) {
    return res
      .status(400)
      .json({ status: 400, message: "DNI must be present" });
  }

  let ProfileImg = {
    dni: req.body.dni,
    nombreImagen: req.body.nombreImagen,
  };

  try {
    if (ProfileImg.nombreImagen !== "") {
      console.log(
        "profiles.controllers.js;;saveImageProfile----Dentro de ProfileIMG--->",
        ProfileImg
      );
      await ProfileImgService.createProfileImg(
        ProfileImg.dni,
        ProfileImg.nombreImagen
      );
    }

    return res.status(201).json({ status: 201, message: "Imagen cargada" });
  } catch (e) {
    console.log("error guardar imagen", e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.addAllergy = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.dni) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var Profile = {
    newAllergy: req.body.newAllergy,
    dni: req.body.dni,
  };

  console.log("Profile", Profile);
  try {
    var updatedProfile = await ProfileService.addAllergy(Profile);
    return res.status(200).json({
      status: 200,
      data: updatedProfile,
      message: "Succesfully Updated Profile",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.addIllness = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.dni) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var Profile = {
    newIllness: req.body.newIllness,
    dni: req.body.dni,
  };

  console.log("Profile", Profile);
  try {
    var updatedProfile = await ProfileService.addIllness(Profile);
    return res.status(200).json({
      status: 200,
      data: updatedProfile,
      message: "Succesfully Updated Profile",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.addControl = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.dni) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var Profile = {
    newControl: JSON.parse(req.body.newControl),
    dni: req.body.dni,
  };
  try {
    var updatedProfile = await ProfileService.addControl(Profile);
    return res.status(200).json({
      status: 200,
      data: updatedProfile,
      message: "Succesfully Updated Profile",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.addVaccine = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.dni) {
    return res.status(400).json({ status: 400, message: "Name be present" });
  }

  var Profile = {
    dni: req.body.dni,
    newVaccine: JSON.parse(req.body.newVaccine),
  };

  console.log("PROFF", Profile);

  try {
    var updatedProfile = await ProfileService.addVaccine(Profile);
    return res.status(200).json({
      status: 200,
      data: updatedProfile,
      message: "Succesfully Updated Profile",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};
