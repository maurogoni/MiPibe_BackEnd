// Gettign the Newly created Mongoose Model we just created 
var ProfileImgModel = require('../models/ProfileImg.model');
var UserModel = require('../models/User.model');
var ProfileModel = require('../models/Profile.model');
var ProfileService = require('../services/profile.service');

// Saving the context of this module inside the _the variable
_this = this

//configurar cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'mipibe', //reemplazar con sus credenciales
    api_key: '259853642279383', 
    api_secret: 'qd0ABYKbgyTvjPyK_hFn30cT6ss'
});

// Async function to get the Contact List
exports.getImagenes = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        var Imagenes = await ProfileImgModel.paginate(query, options)
        // Return the Contact list that was retured by the mongoose promise
        return Imagenes;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Contacts');
    }
}

// Async function to get the Contact List
exports.getImagenesByUser = async function (query, page, limit) {

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }
    // Try Catch the awaited promise to handle the error 
    try {
        var ProfileImagenes = await ProfileImgModel.paginate(query, options)
        // Return the Control list that was retured by the mongoose promise
        return ProfileImagenes;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Desafios');
    }
}

async function savedProfileImg (newProfileImg,oldProfile)
{

    try {
        // Saving the Control 
        var savedProfileImg = await newProfileImg.save();
        return true;
    } catch (e) {
        // return a Error message describing the reason 
    console.log(e)    
    throw Error("Error while Creating Imagen Profile")
}
}


exports.checkExistProfile= async function(_dni){
    //Check profile exists

    let existProfile = await ProfileModel.findOne({
        dni: _dni
    });
    if (existProfile==null){
        throw Error("Error,  Profile doesn't exist.") 
    }
    return existProfile;
}

exports.uploadProfileImg = async function (_nameImage){
    let imagenPathName = process.env.UPLOAD_DIR + _nameImage;
    return await cloudinary.uploader.upload(imagenPathName,{public_id:"22" }, function(result) { 
    });
}

exports.createProfileImg = async function (_dni,_imageName) {
    //subir imagen a cloudinary

    let existOldProfile = await this.checkExistProfile(_dni);
    var newProfile = existOldProfile;
    let resultUploadImage = await this.uploadProfileImg(_imageName);
    
    

    if (existOldProfile.url!=null){
        //TODO Eliminar imagen vieja de cloudinary.
        await this.deleteProfileImg(existOldProfile.dni);
        
    }
    newProfile.url=resultUploadImage.url;
    newProfile.publicIdImage=resultUploadImage.public_id;
    await ProfileService.updateProfile(newProfile);
}


exports.deleteProfileImg = async function (_dni) { 
    //Eliminar imagen de cludinary
    let existProfile = await ProfileModel.findOne({
        dni: _dni
    });
    if (existProfile==null){
        throw Error("Error,  Profile doesn't exist.") 
    }else{
        cloudinary.uploader.destroy(existProfile.publicIdImage);
        //existProfile.url=null;
        //existProfile.publicIdImage=null;
        //await ProfileService.updateProfile(existProfile);
        return true;

    }
    

    
}