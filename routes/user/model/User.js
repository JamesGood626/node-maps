const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new mongoose.Schema({
    email: {type: String, default: ''},
    username: {type: String, default: ''},
    password: {type: String, default: ''}
})

module.exports = mongoose.model('user', UserSchema)