let mongoose = require('mongoose');
let schema = mongoose.Schema;
let user = new schema({
    'name': { type: String, required: true, trim: true },
    'email': { type: String, required: true, trim: true, unique: true },
    'password': { type: String, required: true },
    'apiKey': { type: String, required: true, unique: true },
    'otp': { type: String, default: 'No' }
}, { 'versionKey': false });

module.exports = mongoose.model('userDetail', user);