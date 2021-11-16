var ProfileService = require('../services/profile.service');
var ProfileImgService =require('../services/profileImg.service');
var Profile = require('../models/Profile.model');

// Saving the context of this module inside the _the variable
_this = this;

exports.createProfile = async function (req, res, next) {
    // Req.Body contains the form submit values.
    console.log("llegue al controller de PROFILE-->",req.body)
    var Profile = {
        name: req.body.name,
        surname: req.body.surname,
        dni: req.body.dni,
        dateBorn: req.body.dateBorn,
        bloodType: req.body.bloodType,
        lastControl: req.body.lastControl,
        allergy: req.body.allergy,
        illness: req.body.illness,
        user: req.body.user
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdProfile = await ProfileService.createProfile(Profile)
        if (createdProfile===0){
            console.log("Error. Usuario no registrado: ==>>",Profile.user,"<<==");
            var notExistUser = Profile.user;
            return res.status(400).json({ message: "Error: profile not created, not valid USER:",notExistUser})
        }
        else{
            if (createdProfile===1){
                console.log("Error. Perfil no disponible: ==>>",Profile.dni,"<<==");
                var repeatedDNI = Profile.dni;
                return res.status(400).json({ message: "Error: Profile not disponible, in use.",repeatedDNI})
            }else{
                return res.status(201).json({createdProfile, message: "Succesfully Created Profile"})
            }
        }   
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: "Profile Creation was Unsuccesfull"})
    }
}

// Async Controller function to get the To do List
exports.getProfiles = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 20;
    try {
        var Profiles = await ProfileService.getProfiles({}, page, limit)
        // Return the Profiles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Profiles, message: "Succesfully Profiles Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}
exports.getProfileByDNI = async function (req, res, next) {
    console.log("dentro de getProfilebyDNI en profiles.controller--->dni=",req.body);
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro= {dni: req.body.dni}
    
    try {
        var Profiles = await ProfileService.getProfiles(filtro, page, limit)
        // Return the Profiles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Profiles, message: "Succesfully Profiles Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.getProfileByUser = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    let filtro= {user: req.body.user}
    //console.log("profiles.conroller.js----> filtro: ",filtro);
    try {
        
        var Profiles = await ProfileService.getProfiles(filtro, page, limit);
        //console.log("profiles.conroller.js----> Obtiene esto: ",Object.values(Profiles.docs));
        // Return the Profiles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Profiles, message: "Succesfully Profiles Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.updateProfile = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body.dni) {
        return res.status(400).json({status: 400., message: "Name be present"})
    }

    
    var Profile = {
       
        name: req.body.name ? req.body.name : null,
        surname: req.body.surname ? req.body.surname : null,
        dni: req.body.dni ? req.body.dni : null,
        dateBorn: req.body.dateBorn ? req.body.dateBorn : null,
        bloodType: req.body.bloodType ? req.body.bloodType : null,
        lastControl: req.body.lastControl ? req.body.lastControl : null, //TODO: NO TENDRIA MUCHO SENTIDO.
        allergy: req.body.allergy ? req.body.allergy : null,
        illness: req.body.illness ? req.body.illness : null
    }
    try {
        var updatedProfile = await ProfileService.updateProfile(Profile)
        return res.status(200).json({status: 200, data: updatedProfile, message: "Succesfully Updated Profile"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeProfile = async function (req, res, next) {

    var dni = req.params.dni;
    try {
        var deleted = await ProfileService.deleteProfile(dni);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}

exports.guardarImagenProfile = async function (req, res, next) {

    console.log("ImgProfile",req.body)
    // Id is necessary for the update
    if (!req.body.dni) {
        return res.status(400).json({status: 400., message: "DNI must be present"})
    }

    let ProfileImg = {
        dni: req.body.dni,
        nombreImagen : req.body.nombreImagen
    }
    
    try {
        if (ProfileImg.nombreImagen!=='')
        {
            var newProfileImg = await ProfileImgService.createProfileImg(ProfileImg);
        }
        
        return res.status(201).json({status: 201, message: "Imagen cargada"});
        
    } catch (e) {
        console.log("error guardar imagen",e)
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.getImagenProfileByDNI = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    //obtener filtro
    var filtro = {
        dni: req.body.dni
    }
    try {
        var ProfilesImg = await ProfileImgService.getImagenesByUser(filtro, page, limit)
        // Return the Profiles list with the appropriate HTTP password Code and Message.
        console.log("profileByDni",ProfilesImg)
        if (ProfilesImg.total===0)
            return res.status(201).json({status: 201, data: ProfilesImg, message: "No existe DNI"});
        else
            return res.status(200).json({status: 200, data: ProfilesImg, message: "Succesfully Profiles Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        console.log(e)
        return res.status(400).json({status: 400, message: e.message});
    }
}
    
    
