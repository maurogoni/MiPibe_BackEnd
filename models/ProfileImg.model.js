var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var ProfileImgSchema = new mongoose.Schema({
    date: Date,
    dni: String,
    nombreImagen: String
    
})

ProfileImgSchema.plugin(mongoosePaginate)
const ProfileImg = mongoose.model('PerfilImagen', ProfileImgSchema)

module.exports = ProfileImg;