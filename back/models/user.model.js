const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    login: {type: String, require: true, unique: true},
    name: String,
    role: {type: Number, require: true},
    password: {type: String, require: true},
    accessToken: String,
    refreshToken: String,
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);
