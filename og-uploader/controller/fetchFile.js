let fs = require('fs');
let path = require('path');
let checkFile = require('../services/checkFile');
let hashDecodeFun = require('../services/hashFunction');
let User = require('../helper/userQuery');

module.exports = {
    fetchFile: (req, res, next) => {
        let apiKey = req.params.apiKey;
        let hashName = req.query.url;
        User.keyFind({ 'apiKey': apiKey }).then(data => {
                if (data == null || data.length <= 0) res.sendFile(path.resolve(__dirname, '../public/uploads/brokimage.png'))
                else {
                    let hashNamee = hashName.substr(0, hashName.length - 4);
                    let folderName = hashDecodeFun.decodingFun(hashNamee);
                    folderName = folderName.split(':');
                    folderName = folderName[0];
                    fileUrl = '../public/uploads/' + apiKey + '/' + folderName + '/' + hashName;
                    if (checkFile(fileUrl)) res.sendFile(path.resolve(__dirname, fileUrl));
                    else res.sendFile(path.resolve(__dirname, '../public/uploads/brokimage.png'))
                }
            })
            .catch(err => res.sendFile(path.resolve(__dirname, '../public/uploads/brokimage.png')))
    },

    fileDetails: (req, res, next) => {
        let apiKey = req.body.apiKey;
        let files = req.body.folder;
        let defaultPath = "../public/uploads/" + apiKey + files;
        console.log('Default Path: ', defaultPath);
        User.keyFind({ 'apiKey': apiKey }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Folder Not Found' })
                else {
                    if (checkFile(defaultPath)) {
                        let folders = fs.readdirSync(path.resolve(__dirname, defaultPath));
                        res.status(200).send({ 'status': 200, 'data': (folders.length).toString() })
                    } else res.status(404).send({ 'status': 404, 'err': 'Invalid Apikey' });
                }
            })
            .catch(err => {
                console.log('Error ', err);
                res.status(500).send({ 'status': 500 })
            })

    }
}