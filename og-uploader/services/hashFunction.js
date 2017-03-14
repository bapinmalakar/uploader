let base64 = require('base-64');
let base32 = require('base32');
let utf8 = require('utf8');

module.exports = {
    encodingFun: (fileDetailText) => {
        let bytes = utf8.encode(fileDetailText);
        let encodeText = base64.encode(bytes);
        console.log('Encoded Hash Name: ', encodeText);
        return encodeText;
    },

    decodingFun: (hashName) => {
        let bytes = base64.decode(hashName);
        let decodeText = utf8.decode(bytes);
        console.log('Decode Text: ', decodeText);
        return decodeText;
    },

    base32Encoding: (email) => {
        return base32.encode(email);
    },

    base32Decoding: (apiKey) => {
        return base32.decode(apiKey);
    }
}