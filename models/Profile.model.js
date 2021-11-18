var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var ProfileSchema = new mongoose.Schema({
    name: String,
    surname:String,
    dni: String,
    dateBorn: Date,
    bloodType: String,
    lastControl: String,
    allergy: String,
    illness: String,
    user: String,
    date: Date,
    url: String,
    publicIdImage: String
})

ProfileSchema.plugin(mongoosePaginate)
const Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile;