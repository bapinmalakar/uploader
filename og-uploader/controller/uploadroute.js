let multer = require('multer');
let path = require('path');
let fs = require('fs');
let directoryClass = require('../helper/directory');
let extensionCheck = require('../services/checkExtension');
let directoryFun = new directoryClass('', '', '');
let hashFun = require('../services/hashFunction');
let urlUpload = require('../services/uploadFromUrl');
let User = require('../helper/userQuery');


let directoryFunction = (apiKey) => {
    let date = new Date();
    directoryFun.folderName = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString();
    directoryFun.directoryPath = path.resolve(__dirname, '../public/uploads/');
    directoryFun.apiKey = apiKey;
    directoryFun.createDirectory();
}

let keyFind = (apiKey) => {
    return new Promise((resolve, reject) => {
        User.keyFind({ 'apiKey': apiKey }).then(data => {
            if (data == null || data.length <= 0) resolve(2);
            else resolve(1);
        }).
        catch(err => reject(err))
    })
}

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let apiKey = req.body.apiKey;
        keyFind(apiKey).then(result => {
                if (result == 1) {
                    let ext = path.extname(file.originalname);
                    ext = ext.toLowerCase();
                    directoryFunction(apiKey);
                    let val = extensionCheck(ext);
                    if (val == 1) {
                        fileUrl = directoryFun.folderName + '/images/';
                        fileType = ext;
                        cb(null, path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.apiKey + '/' + directoryFun.folderName + '/images/'));
                    } else {
                        fileUrl = directoryFun.folderName + '/documents/';
                        fileType = ext;
                        console.log('Document Upload Path: ', path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.apiKey + '/' + directoryFun.folderName + '/documents/'))
                        cb(null, path.resolve(__dirname, directoryFun.directoryPath + '/' + directoryFun.apiKey + '/' + directoryFun.folderName + '/documents/'));
                    }
                } else if (result == 2) cb({ 'data': 2 })
                else cb({ 'data': 3 })
            })
            .catch(err => cb({ 'data': 3 }))
    },
    filename: (req, file, cb) => {
        actualName = file.originalname;
        fileSize = file.size;
        let hashText = fileUrl + ':' + (new Date().getTime()).toString() + ':' + file.originalname;
        hashEncod = hashFun.encodingFun(hashText) + fileType;
        cb(null, hashEncod);
    }
});

var uploadFile = multer({
    storage: storage,
}).any();

module.exports = {
    uploadFile: (req, res, next) => {
        console.log('In Upload Router');
        if (req.body.link) {
            let url = req.body.link;
            let apiKey = req.body.apiKey;
            if (path.extname(url) == '' || path.extname(url) == null || path.extname(url) == undefined)
                res.status(422).send({ 'status': 0, 'err': 'Extension Missing' })
            else {
                User.keyFind({ 'apiKey': apiKey }).then(data => {
                    if (data == null || data.length <= 0) res.status(404).send({ 'status': 0, 'err': 'Invalid Apikey' })
                    else {
                        directoryFunction(apiKey);
                        let linkFileName = urlUpload.findName(url);
                        urlUpload.fileUpload(url, linkFileName, directoryFun.folderName, directoryFun.directoryPath, directoryFun.apiKey)
                            .then(data => res.status(200).send({ 'status': 1, 'data': data }))
                            .catch(err => {
                                if (err.statusCode == 404) res.status(404).send({ 'status': 1, 'err': 'Link is Invalid' })
                                else res.status(200).send('Internal Error')
                            })
                    }
                }).catch(err => res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' }))
            }
        } else {
            uploadFile(req, req.body.file, function(err, data) {
                if (err) {
                    console.log('Error due to upload', err);
                    if (err.data == 2) res.status(404).send({ 'status': 0, 'err': 'Invalid Api' });
                    else res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' })
                } else {
                    let data = {
                        'fileName': hashEncod,
                        'fileType': fileType,
                        'fileSize': fileSize,
                        'actualName': actualName
                    };
                    res.status(200).send({
                        'status': 1,
                        'data': data
                    })
                }
            });
        }
    }
}