var UserService = require("../services/user.service");
var ProfileService = require("../services/profile.service");
const User = require("../models/User.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.createUser = async function (req, res, next) {
  var User = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    user: req.body.user,
    password: req.body.password,
  };

  try {
    var createdUser = await UserService.createUser(User);
    if (createdUser === 0) {
      console.log("Error. mail existente: ==>>", User.email, "<<==");
      return res.status(400).json({ message: "Error: mail ya en uso." });
    } else {
      if (createdUser === 1) {
        console.log("Error. Usuario no disponible: ==>>", User.user, "<<==");
        var repeatedUser = User.user;
        return res.status(400).json({
          message: "Error: nombre de usuario en uso.",
          repeatedUser,
        });
      } else {
        return res
          .status(201)
          .json({ createdUser, message: "Usuario creado con exito!" });
      }
    }
  } catch (e) {
    console.log(e);
    return res
      .status(400)
      .json({ status: 400, message: "User Creation was unsuccesfull" });
  }
};

exports.loginUser = async function (req, res, next) {
  var User = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    var loginUser = await UserService.loginUser(User);
    if (!loginUser) {
      return res.status(404).json({ loginUser, message: "Usuario invalido!" });
    }
    return res.status(201).json({ loginUser, message: "Bienvenido!" });
  } catch (e) {
    return res
      .status(400)
      .json({ status: 400, message: "Invalid username or password" });
  }
};

exports.forgotPassword = async function (req, res, next) {
  if (!req.body.email) {
    return res
      .status(400)
      .json({ status: 400, message: "Email must be present" });
  }

  var User = {
    email: req.body.email,
  };

  try {
    var updatedUser = await UserService.forgotPassword(User);
    if (!updatedUser) {
      return res.status(400).json({
        status: 400,
        data: User,
        message: "No se encontro el usuario.",
      });
    }
    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "Mail con nueva contrasena enviado!",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.updateUser = async function (req, res, next) {
  if (
    !req.body.name ||
    !req.body.surname ||
    !req.body.email ||
    !req.body.user ||
    !req.body.password
  ) {
    return res.status(500).json({ status: 500, message: "Invalido" });
  }

  var User = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    user: req.body.user,
    password: req.body.password,
  };
  try {
    var updatedUser = await UserService.updateUser(User);
    if (updatedUser === 0) {
      return res.status(404).json({
        status: 404,
        data: User,
        message: "No se encontro el usuario.",
      });
    } else if (updatedUser === 1) {
      return res.status(400).json({
        status: 400,
        data: User,
        message: "Password invalid",
      });
    } else if (updatedUser === 2) {
      return res.status(409).json({
        status: 409,
        data: User,
        message: "Email already in use",
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: updatedUser,
        message: "Succesfully Updated User",
      });
    }
  } catch (e) {
    return res.status(500).json({ status: 500, message: e.message });
  }
};

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 20;
  try {
    var Users = await UserService.getUsers({}, page, limit);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: "Succesfully Users Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};
exports.getUsersByMail = async function (req, res, next) {
  try {
    var Users = await UserService.getUsers({ email: req.query.email });
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      data: Users,
      message: "Succesfully Users Recieved",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.updatePassword = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body.user) {
    return res
      .status(400)
      .json({ status: 400, message: "User must be present" });
  }

  var User = {
    user: req.body.user,
    password: req.body.password,
    newpassword: req.body.newpassword,
  };

  try {
    var updatedUser = await UserService.updatePassword(User);
    if (!updatedUser) {
      return res.status(400).json({
        status: 400,
        data: User,
        message: "No se encontro el usuario.",
      });
    }
    return res.status(200).json({
      status: 200,
      data: updatedUser,
      message: "Succesfully Updated User",
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.removeUser = async function (req, res, next) {
  var id = req.params.user;
  console.log("users.controller.js ------> Recibe de parametro id:", id);
  try {
    var deleted = await UserService.deleteUser(id);
    if (deleted == 0) {
      return res
        .status(400)
        .json({ status: 400, data: id, message: "No se encontro el usuario." });
    }
    //TODO
    res.status(200).send("Succesfully Deleted... ");
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.guardarImagenUser = async function (req, res, next) {
  console.log("ImgUser", req.body);
  // Id is necessary for the update
  if (!req.body.email) {
    return res
      .status(400)
      .json({ status: 400, message: "Mail must be present" });
  }

  let userImg = {
    email: req.body.email,
    nombreImagen: req.body.nombreImagen,
  };

  try {
    if (userImg.nombreImagen !== "") {
      var newUserImg = await UserImgService.createUserImg(userImg);
    }

    return res.status(201).json({ status: 201, message: "Imagen cargada" });
  } catch (e) {
    console.log("error guardar imagen", e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};

exports.getImagenUserByMail = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var page = req.query.page ? req.query.page : 1;
  var limit = req.query.limit ? req.query.limit : 10;
  //obtener filtro
  var filtro = {
    mail: req.body.email,
  };
  try {
    var UsersImg = await UserImgService.getImagenesByUser(filtro, page, limit);
    // Return the Users list with the appropriate HTTP password Code and Message.
    console.log("userByDni", UsersImg);
    if (UsersImg.total === 0)
      return res
        .status(201)
        .json({ status: 201, data: UsersImg, message: "No existe Mail" });
    else
      return res.status(200).json({
        status: 200,
        data: UsersImg,
        message: "Succesfully Users Recieved",
      });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};
