// Gettign the Newly created Mongoose Model we just created
var User = require("../models/User.model");
const { sendMail } = require("./mail.service");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { json } = require("express");

// Saving the context of this module inside the _the variable
_this = this;

exports.createUser = async function (_user) {
  try {
    const emailAlreadyInUse = await User.findOne({
      email: _user.email,
    });
    var usernameAlreadyInUse = await User.findOne({
      user: _user.user,
    });

    if (!emailAlreadyInUse && !usernameAlreadyInUse) {
      var newUser = new User({
        name: _user.name,
        surname: _user.surname,
        email: _user.email,
        user: _user.user,
        password: bcrypt.hashSync(_user.password, 8),
        date: new Date(),
      });

      var savedUser = await newUser.save();

      var token = jwt.sign({ id: savedUser._id }, process.env.SECRET, {
        expiresIn: 86400, // expires in 24 hours
      });
      return token;
    } else {
      if (!usernameAlreadyInUse) {
        return 0;
      } else {
        return 1;
      }
    }
  } catch (e) {
    console.log(e);
    throw Error("Error while creating user");
  }
};

exports.loginUser = async function (user) {
  try {
    var userStored = await User.findOne({
      email: user.email,
    });

    if (!userStored) return 0;

    var passwordIsValid = bcrypt.compareSync(
      user.password,
      userStored.password
    );
    if (!passwordIsValid) return 0;

    var token = jwt.sign(
      {
        id: userStored._id,
      },
      process.env.SECRET,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
    return { token: token, user: userStored };
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Login User");
  }
};

exports.forgotPassword = async function (user) {
  try {
    var storedUser = await User.findOne({ email: user.email });
  } catch (e) {
    throw Error("Error occured while Finding the User");
  }
  if (!storedUser) {
    return 0;
  }

  const newPassword = Math.floor(Math.random() * 99999 + 99999);
  storedUser.password = bcrypt.hashSync(newPassword.toString(), 8);

  try {
    await storedUser.save();
    const info = await sendMail(
      user.email,
      "Recupero contrasena",
      "<h1> Contrasena temporal  </h1><h3>" + newPassword.toString() + "</h3>"
    );
    return info;
  } catch (e) {
    throw Error("And Error occured while updating the User");
  }
};

exports.updateUser = async function (user) {
  try {
    var storedUser = await User.findOne({ user: user.user });
  } catch (e) {
    throw Error("Error occured while Finding the User");
  }
  if (!storedUser) {
    return 0;
  }

  var hashedPassword = bcrypt.hashSync(user.password, 8);
  const samePassword = bcrypt.compareSync(user.password, storedUser.password);
  if (!samePassword) {
    return 1;
  }

  const userOfEmail = await User.findOne({ email: user.email });
  if (userOfEmail.user !== storedUser.user) {
    return 2;
  }

  storedUser.name = user.name;
  storedUser.surname = user.surname;
  storedUser.email = user.email;
  storedUser.user = user.user;
  storedUser.password = hashedPassword;
  try {
    var savedUser = await storedUser.save();
    return savedUser;
  } catch (e) {
    throw Error("And Error occured while updating the User");
  }
};

// Async function to get the User List
exports.getUsers = async function (query) {
  try {
    var Users = await User.find(query);
    // Return the Userd list that was retured by the mongoose promise
    return Users;
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Users");
  }
};

exports.updatePassword = async function (user) {
  var id = { user: user.user };
  console.log("user", user);
  try {
    //Find the old User Object by the Id
    var oldUser = await User.findOne(id);
  } catch (e) {
    throw Error("Error occured while Finding the User");
  }
  // If no old User Object exists return false
  if (!oldUser) {
    console.log(
      "user.service.js -----> No se encontro el usuario para updatear."
    );
    return false;
  }
  console.log("user.service.js -----> Existe usuario para updatear.");
  //Edit the User Object

  const samePassword = bcrypt.compareSync(user.password, oldUser.password);
  if (!samePassword) {
    throw Error("Password does not match");
  }

  console.log("user.newpassword", user.newpassword);
  oldUser.password = bcrypt.hashSync(user.newpassword, 8);
  console.log("newpassword hash", oldUser.password);

  try {
    console.log(
      "user.service.js -----> Guardo el usuario en la base de datos."
    );
    var savedUser = await oldUser.save();
    return savedUser;
  } catch (e) {
    throw Error("And Error occured while updating the User");
  }
};

exports.deleteUser = async function (id) {
  console.log("user.service.js---deleteUser--> Ingreso con id:", id);
  var _existID = await User.findOne({
    user: id,
  });

  if (_existID == null) {
    console.log(
      "user.service.js---deleteUser--> No se encontro usuario con ese ID:",
      id
    );
    return 0;
  }
  // Delete the User
  try {
    console.log("Intentando eliminar ID:", id);
    var deleted = await User.remove({
      user: id,
    });

    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("User Could not be deleted");
    }
    return deleted;
  } catch (e) {
    throw Error("Error Occured while Deleting the User");
  }
};
