let fs = require('fs');
let path = require('path');
let User = require('../helper/userQuery');
let folderSize = require('../services/fileSize');

module.exports = (req, res, next) => {
    console.log('Request: ', req.url);
    let apiKey = req.params.apiKey;
    let subDirInfo = [];
    let subDirSize = [];
    let subDirInfoBreak = [];
    let defaultPath = '../public/uploads' + '/' + apiKey;
    console.log('defaultPth: ', defaultPath);
    User.keyFind({ 'apiKey': req.params.apiKey }).then(data => {
            if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'Invalid Api Key' })
            else {
                dirArray = fs.readdirSync(path.resolve(__dirname, defaultPath))
                    .filter(dir => fs.statSync(path.join(path.resolve(__dirname, defaultPath), dir)).isDirectory())
                console.log('dirArray', dirArray);
                if (dirArray == null || dirArray.length <= 0) res.status(422).send({ 'status': 422, 'err': 'No Directory Created Yet' })
                else {
                    dirArray.forEach((dir) => {
                        subDirInfo.push(
                            fs.readdirSync(path.resolve(__dirname, defaultPath + '/' + dir))
                            .filter(subDir => fs.statSync(path.join(path.resolve(__dirname, defaultPath + '/' + dir), subDir)).isDirectory())
                            .map(ds => '/' + dir + '/' + ds)
                        )
                    })
                    subDirInfo.forEach((dir) => {
                        dir.forEach(ds => subDirInfoBreak.push({ name: ds, size: '' }))
                    })
                    let promiseArray = [];
                    subDirInfoBreak.forEach(ds => promiseArray.push(folderSize(ds, apiKey)));
                    Promise.all(promiseArray)
                        .then(rs => {
                            let totalSiz = 0;
                            rs.forEach(rd => {
                                totalSiz = parseFloat(rd.size) + totalSiz;
                                rd.size = rd.size + 'MB';
                            })
                            res.status(200).send({ 'status': 1, 'totalSize': totalSiz, 'data': rs, 'folderArray': dirArray })
                        })
                        .catch(err => {
                            console.log('Error: ', err);
                            res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' })
                        })
                }
            }
        })
        .catch(err => {
            console.log('Error2: ', err);
            res.status(500).send({ 'status': 0, 'err': 'Internal Server Error' })
        })
}