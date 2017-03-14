let fs = require('fs');
let path = require('path');

module.exports = class {
    constructor(directoryPath, folderName, apiKey) {
        this.folderName = folderName;
        this.directoryPath = directoryPath;
        this.apiKey = apiKey;
        this.directoryCheck();
        this.createDirectory();
    }

    directoryCheck(filename) {
        if (fs.existsSync(filename)) return 1;
        else return 0;
    }

    createDirectory() {
        console.log('Path: ', this.directoryPath, 'Folder Name: ', this.folderName, 'Api Key: ', this.apiKey);
        if (fs.existsSync(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName))) {
            console.log('Exist');
            // Image Folder Checking....
            if (this.directoryCheck(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName + '/images')))
                console.log(' Image Folder Exist')
            else fs.mkdirSync(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName + '/images'))

            //Document Folder Checking....
            if (this.directoryCheck(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName + '/documents')))
                console.log(' Directory Exist')
            else fs.mkdirSync(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName + '/documents'))

        } else {
            console.log('Not Exist');
            fs.mkdirSync(path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName));
            let newPath = path.resolve(__dirname, this.directoryPath + '/' + this.apiKey + '/' + this.folderName);
            console.log('New Path:', newPath);
            let imgCreate = fs.mkdirSync(path.resolve(__dirname, newPath + '/images'));
            console.log('Image Directory Created');
            let docCreate = fs.mkdirSync(path.resolve(__dirname, newPath + '/documents'));
            console.log('Document Created');
            console.log('Directory Created', this.folderName);
        }
    }
}