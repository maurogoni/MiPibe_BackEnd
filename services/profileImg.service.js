// Gettign the Newly created Mongoose Model we just created 
var ProfileImg = require('../models/ProfileImg.model');

//var bcrypt = require('bcryptjs');
//var jwt = require('jsonwebtoken');

// Saving the context of this module inside the _the variable
_this = this

//configurar cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'sarasapaula', //reemplazar con sus credenciales
    api_key: '827784374844765', 
    api_secret: 'EfhdI2XXe-jM6JzOKaIX8FEDTDY'
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
        var Imagenes = await ProfileImg.paginate(query, options)
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
    console.log("byDni",query)
    try {
        var ProfileImagenes = await ProfileImg.paginate(query, options)
        // Return the Control list that was retured by the mongoose promise
        console.log("profileImage.service.js -----> Imagenes by dni",ProfileImagenes)
        return ProfileImagenes;

    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Desafios');
    }
}

async function savedProfileImg (newProfileImg)
{

    try {
        // Saving the Control 
        var savedProfileImg = await newProfileImg.save();
        
        return savedProfileImg;
    } catch (e) {
        // return a Error message describing the reason 
    console.log(e)    
    throw Error("Error while Creating Imagen Profile")
}
}
exports.createProfileImg = async function (profileImg) {
    
    //subir imagen a cloudinary
    console.log("profileImg",profileImg)
    let urlImg;
    let imagen = process.env.UPLOAD_DIR + profileImg.nombreImagen;
    cloudinary.uploader.upload(imagen, function(result) { 
        console.log("Resultado",result);
        //urlImg=result.url;
        // Creating a new Mongoose Object by using the new keyword
        var newProfileImg = new ProfileImg({      
            dni: profileImg.dni,
            date: new Date(),
            nombreImagen: result.url
        })
        
        savedProfileImg(newProfileImg);
    });   
}