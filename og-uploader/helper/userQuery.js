let user = require('../models/user');

module.exports = {
    emailFind: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOne({ 'email': obj.email }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    insertData: (obj) => {
        return new Promise((resolve, reject) => {
            user.create(obj, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    keyFind: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOne({ 'apiKey': obj.apiKey }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    login: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOne({ 'email': obj.email, 'password': obj.password }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    otpUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOneAndUpdate({ 'email': obj.email }, { $set: { 'otp': obj.otp } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    otpVerify: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOneAndUpdate({ 'email': obj.email, 'otp': obj.otp }, { $set: { 'otp': 'No' } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    },

    passwordUpdate: (obj) => {
        return new Promise((resolve, reject) => {
            user.findOneAndUpdate({ 'email': obj.email }, { $set: { 'password': obj.password } }, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
    }
}