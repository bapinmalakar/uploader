let User = require('../helper/userQuery');
let nodeEmail = require('../services/sendMail');

module.exports = {
    login: (req, res, next) => {
        User.login({ 'email': req.body.email, 'password': req.body.password }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Userid or Password invalid' })
                else res.status(200).send({ 'status': 200, 'data': data })
            })
            .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
    },

    otpSend: (req, res, next) => {
        if (!req.body.email) res.status(422).send({ 'status': 422, 'err': 'email required' })
        else {
            let otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
            console.log('Otp is: ', otp);
            User.otpUpdate({ 'email': req.body.email, 'otp': otp }).then(data => {
                    if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Your Account Not Found' })
                    else {
                        nodeEmail({
                                'email': req.body.email,
                                'subject': 'Password Recovery One-Time Code',
                                'msg': 'Recovery 5-Digit Code',
                                'html_msg': '<h1>Use Below 5-Digit Code For Reset Your Password</h1><br><h3>5-Digit Code is: ' + otp + '</h3>'
                            })
                            .then(snd => res.status(200).send({ 'status': 200, 'msg': 'Ok' }))
                            .catch(err => res.status(500).send({ 'status': 500, 'err': ' Internal Server Error' }))
                    }
                })
                .catch(err => res.status(500).send({ 'status': 500, 'err': ' Internal Server Error' }))
        }
    },

    otpVerify: (req, res, next) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'err': 'Not Valid Request Form' })
        else if (req.body.email == null || req.body.email == '' || req.body.otp == null || req.body.otp == '' || req.body.otp == 'No' || req.body.otp == 'NO')
            req.status(422).send({ 'status': 422, 'err': 'Not Valid data' })
        else {
            User.otpVerify({ 'email': req.body.email, 'otp': req.body.otp }).then(data => {
                    if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Inavlid User' })
                    else res.status(200).send({ 'status': 200, 'data': 'Ok Verify' })
                })
                .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
        }
    },

    passwordUpdate: (req, res, next) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'err': 'Not Valid Request Form' })
        else if (req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '')
            req.status(422).send({ 'status': 422, 'err': 'Not Valid data' })
        else {
            User.passwordUpdate({ 'email': req.body.email, 'password': req.body.password }).then(data => {
                    if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Inavlid User' })
                    else res.status(200).send({ 'status': 200 })
                })
                .catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
        }
    }
}