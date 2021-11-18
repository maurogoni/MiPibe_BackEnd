// Gettign the Newly created Mongoose Model we just created
var User = require("../models/User.model");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { json } = require("express");
const { forgotPassword } = require("../controllers/mail.controller");
let nodemailer = require("nodemailer");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the User List
exports.getUsers = async function (query, page, limit) {
  // Options setup for the mongoose paginate
  var options = {
    page,
    limit,
  };
  // Try Catch the awaited promise to handle the error
  try {
    console.log("Query", query);
    var Users = await User.paginate(query, options);
    // Return the Userd list that was retured by the mongoose promise
    return Users;
  } catch (e) {
    // return a Error message describing the reason
    console.log("error services", e);
    throw Error("Error while Paginating Users");
  }
};

exports.createUser = async function (_user) {
  // Creating a new Mongoose Object by using the new keyword
  var hashedPassword = bcrypt.hashSync(_user.password, 8);

  var newUser = new User({
    name: _user.name,
    surname: _user.surname,
    email: _user.email,
    user: _user.user,
    password: hashedPassword,
    date: new Date(),
  });

  try {
    var _existEmail = await User.findOne({
      email: _user.email,
    });
    var _existUser = await User.findOne({
      user: _user.user,
    });
    if (_existEmail == null && _existUser == null) {
      console.log("======== Mail no registrado, se creara usuario ==========");
      // Saving the User
      var savedUser = await newUser.save();
      var token = jwt.sign(
        {
          id: savedUser._id,
        },
        process.env.SECRET,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );
      return token;
    } else {
      if (_existUser == null) {
        console.log(
          "======== El mail ya esta registrado con el siguiente Id ---->",
          _existEmail._id,
          "<----------- =========="
        );
        return 0;
      } else {
        console.log(
          "======== Usuario no disponble, ya esta en uso. Id del usuario registrado: ---->",
          _existUser._id,
          "<----------- =========="
        );
        return 1;
      }
    }
  } catch (e) {
    // return a Error message describing the reason
    console.log(e);
    throw Error("Error while Creating User");
  }
};

exports.updateUser = async function (user) {
  var id = { user: user.user };

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
  var hashedPassword = bcrypt.hashSync(user.password, 8);

  const samePassword = bcrypt.compareSync(user.password, oldUser.password);
  if (!samePassword) {
    throw Error("Password does not match");
  }

  console.log("samePassword", samePassword);

  oldUser.name = user.name;
  oldUser.surname = user.surname;
  oldUser.email = user.email;
  oldUser.user = user.user;
  oldUser.password = hashedPassword;
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

exports.loginUser = async function (user) {
  // Creating a new Mongoose Object by using the new keyword
  try {
    // Find the User
    console.log("login:", user);
    var _details = await User.findOne({
      email: user.email,
    });
    var passwordIsValid = bcrypt.compareSync(user.password, _details.password);
    if (!passwordIsValid) throw Error("Invalid username/password");

    var token = jwt.sign(
      {
        id: _details._id,
      },
      process.env.SECRET,
      {
        expiresIn: 86400, // expires in 24 hours
      }
    );
    return { token: token, user: _details };
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Login User");
  }
};

exports.forgotPassword = async function (user) {
  var id = { email: user.email };

  try {
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

  const newPassword = Math.floor(Math.random() * 99999 + 99999);
  console.log("user.newpassword", newPassword);
  oldUser.password = bcrypt.hashSync(newPassword.toString(), 8);

  try {
    console.log(
      "user.service.js -----> Guardo el usuario en la base de datos."
    );
    var savedUser = await oldUser.save();

    var transporter = nodemailer.createTransport({
      //host: 'svp-02715.fibercorp.local',
      //secure: false,
      port: 25,
      service: "Gmail",
      secure: false,
      auth: {
        user: "mipibeapp@gmail.com", //poner cuenta gmail
        pass: "mipibe123", //contraseña cuenta  IMPORTANTE HABILITAR acceso apps poco seguras google
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // Definimos el email
    var mailOptions = {
      from: "mipibeapp@gmail.com",
      to: user.email,
      subject: "Recupero contrasena",
      html:
        "<h1> Contrasena temporal  </h1><h3>" +
        newPassword.toString() +
        "</h3>",
    };
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (e) {
    throw Error("And Error occured while updating the User");
  }
};
