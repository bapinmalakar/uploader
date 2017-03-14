let fs = require('fs');
let path = require('path');
let checkFile = require('../services/checkFile');
let hashDecodeFun = require('../services/hashFunction');
let User = require('../helper/userQuery');

module.exports = (req, res, next) => {
    let apiKey = req.params.apiKey;
    let hashName = req.query.url;
    if(hashName == null || hashName == '') res.status(422).send({'status': 0, 'err': 'Hash name required'})
    User.keyFind({ 'apiKey': apiKey }).then(data => {
            if (data == null || data.length <= 0) res.status(404).send({'status':0,'err': 'Apikey Invalid'})
            else {

                let hashNamee = hashName.substr(0, hashName.length - 4);
                let folderName = hashDecodeFun.decodingFun(hashNamee);
                folderName = folderName.split(':');
                folderName = folderName[0];
                fileUrl = '../public/uploads/' + apiKey + '/' + folderName + '/' + hashName;
                if (checkFile(fileUrl)) {
                    fs.unlinkSync(path.resolve(__dirname, fileUrl));
                    res.status(200).send({ 'status': 1, 'data': 'File Successfully Deleted' })
                } else res.status(404).send({ 'status': 0, 'data': 'File Not Found' })
            }
        })
        .catch(err => res.status(500).send({'status': 0, 'err': 'Internal Server Error'}))
}