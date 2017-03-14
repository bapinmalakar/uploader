let User = require('../helper/userQuery');
let base32 = require('../services/hashFunction');
let fs = require('fs');
let path = require('path');

module.exports = (req, res, next) => {
    if (!req.body) res.status(204).send({ 'status': 0, 'err': 'Empty Request' })
    if (!req.body.email) res.status(422).send({ 'status': 0, 'err': 'Email Address Required' });
    else if (!req.body.name) res.status(422).send({ 'status': 0, 'err': 'Name Required' });
    else if (!req.body.password) res.status(422).send({ 'status': 0, 'err': 'Password Required' });
    else {
        let obj = {
            'name': req.body.name,
            'email': req.body.email,
            'password': req.body.password,
            'apiKey': ''
        };

        User.emailFind(obj).then(result => {
            if (result == null || result.length <= 0) {
                obj.apiKey = base32.base32Encoding(obj.email);
                User.insertData(obj).then((data) => {
                    console.log('Data Inserted: ');
                    fs.mkdirSync(path.resolve(__dirname, '../public/uploads/' + obj.apiKey));
                    res.status(200).send({ 'status': 1, 'msg': 'Successfully Account Created', 'data': obj });
                }).catch(error => {
                    console.log('Errror>>>>>>>> ', error);
                    res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' })
                })
            } else res.status(422).send({ 'status': 2, 'err': 'Duplicate Email' })
        }).catch(err => {
            console.log('Error--------->>>> ', err);
            res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' })
        })
    }
}