// Gettign the Newly created Mongoose Model we just created
var Profile = require("../models/Profile.model");
var jwt = require("jsonwebtoken");
var UserModel = require("../models/User.model");
const { json } = require("express");

// Saving the context of this module inside the _the variable
_this = this;

exports.createProfile = async function (_profile) {
  // Creating a new Mongoose Object by using the new keyword

  var newProfile = new Profile({
    name: _profile.name,
    surname: _profile.surname,
    dni: _profile.dni,
    dateBorn: _profile.dateBorn,
    bloodType: _profile.bloodType,
    lastControl: "-",
    allergy: [],
    illness: [],
    control: [],
    vaccine: [],
    user: _profile.user,
    date: new Date(),
  });

  try {
    var _existDNI = await Profile.findOne({
      dni: _profile.dni,
    });
    var _existUser = await UserModel.findOne({
      user: _profile.user,
    });

    if (_existDNI == null) {
      if (_existUser == null) {
        console.log(
          "======== Perfil no tiene usuario valido. Usuario no registrado: ---->",
          _existUser,
          "<----------- =========="
        );
        return 0;
      } else {
        console.log("======== DNI no registrado, se creara perfil ==========");
        // Saving the Profile
        var savedProfile = await newProfile.save();
        var token = jwt.sign(
          {
            id: savedProfile._id,
          },
          process.env.SECRET,
          {
            expiresIn: 86400, // expires in 24 hours
          }
        );
        return token;
      }
    } else {
      console.log(
        "======== Perfil no disponble, ya esta en uso. DNI del usuario registrado: ---->",
        _existDNI,
        "<----------- =========="
      );
      return 1;
    }
  } catch (e) {
    // return a Error message describing the reason
    console.log(e);
    throw Error("Error while Creating Profile");
  }
};

// Async function to get the Profile List
exports.getProfiles = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit,
  };
  // Try Catch the awaited promise to handle the error
  try {
    console.log("Query Profiles:", query);
    var Profiles = await Profile.paginate(query, options);
    // Return the Profile list that was retured by the mongoose promise
    return Profiles;
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Profiles");
  }
};

exports.getProfilesByUser = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit,
  };
  // Try Catch the awaited promise to handle the error
  try {
    console.log("Query Profiles:", query);
    var Profiles = await Profile.paginate(query, options);
    // Return the Profile list that was retured by the mongoose promise
    return Profiles;
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Profiles");
  }
};

exports.updateProfile = async function (profile) {
  var id = { dni: profile.dni };

  try {
    //Find the old Profile Object by the Id
    var oldProfile = await Profile.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the Profile");
  }
  // If no old Profile Object exists return false
  if (!oldProfile) {
    return false;
  }
  //Edit the Profile Object

  oldProfile.name = profile.name;
  oldProfile.surname = profile.surname;
  oldProfile.dni = profile.dni;
  oldProfile.bloodType = profile.bloodType;

  try {
    var savedProfile = await oldProfile.save();
    return savedProfile;
  } catch (e) {
    throw Error("And Error occured while updating the Profile");
  }
};

exports.deleteProfile = async function (dni) {
  // Delete the Profile
  console.log("DNI", dni);
  try {
    var deleted = await Profile.remove({
      dni: dni,
    });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Profile Could not be deleted");
    }
    return deleted;
  } catch (e) {
    throw Error("Error Occured while Deleting the Profile");
  }
};

exports.addAllergy = async function ({ dni, newAllergy }) {
  var id = { dni: dni };

  try {
    //Find the old Profile Object by the Id
    var oldProfile = await Profile.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the Profile");
  }
  // If no old Profile Object exists return false
  if (!oldProfile) {
    return false;
  }
  //Edit the Profile Object

  oldProfile.allergy = oldProfile.allergy.concat(newAllergy);

  try {
    var savedProfile = await oldProfile.save();
    return savedProfile;
  } catch (e) {
    throw Error("And Error occured while updating the Profile");
  }
};

exports.addIllness = async function ({ dni, newIllness }) {
  var id = { dni: dni };

  try {
    //Find the old Profile Object by the Id
    var oldProfile = await Profile.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the Profile");
  }
  // If no old Profile Object exists return false
  if (!oldProfile) {
    return false;
  }
  //Edit the Profile Object

  oldProfile.illness = oldProfile.illness.concat(newIllness);

  try {
    var savedProfile = await oldProfile.save();
    return savedProfile;
  } catch (e) {
    throw Error("And Error occured while updating the Profile");
  }
};

exports.addControl = async function ({ dni, newControl }) {
  var id = { dni: dni };

  try {
    //Find the old Profile Object by the Id
    var oldProfile = await Profile.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the Profile");
  }
  // If no old Profile Object exists return false
  if (!oldProfile) {
    return false;
  }
  //Edit the Profile Object

  oldProfile.control = oldProfile.control.concat(newControl);

  try {
    var savedProfile = await oldProfile.save();
    return savedProfile;
  } catch (e) {
    throw Error("And Error occured while updating the Profile");
  }
};

exports.addVaccine = async function ({ dni, newVaccine }) {
  var id = { dni: dni };

  try {
    //Find the old Profile Object by the Id
    var oldProfile = await Profile.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the Profile");
  }
  // If no old Profile Object exists return false
  if (!oldProfile) {
    return false;
  }
  //Edit the Profile Object

  oldProfile.vaccine = oldProfile.vaccine.concat(newVaccine);

  try {
    var savedProfile = await oldProfile.save();
    return savedProfile;
  } catch (e) {
    throw Error("And Error occured while updating the Profile");
  }
};
