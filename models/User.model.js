var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var UserSchema = new mongoose.Schema({
    name: String,
    surname:String,
    email: String,
    user: String,
    password: String,
    date: Date
})

UserSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', UserSchema)

module.exports = User;