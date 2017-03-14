let path = require('path');
let getsize = require('get-folder-size');

module.exports = (dir, apiKey) => {
    return new Promise((resolve, reject) => {
        let lastPart = dir;
        lastPart = lastPart.name;
        let solvePath = path.resolve(__dirname, '../public/uploads/' + apiKey + '/' + lastPart);
        getsize(solvePath, function(err, size) {
            if (err) reject(err);
            else {
                dir.size = (size / 1024 / 1024).toFixed(2);
                resolve(dir);
            }
        });
    })
}