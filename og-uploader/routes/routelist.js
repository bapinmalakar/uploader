let express = require('express');
let router = express.Router();
let registration = require('../controller/apiRegistration');
let bodyparser = require('body-parser');
let uploadController = require('../controller/uploadroute');
let fetchFile = require('../controller/fetchFile');
let fileListing = require('../controller/fileListSize');
let deleteFile = require('../controller/imageDelete');
let accountControl = require('../controller/accountControl');
let cors = require('cors');

router.use(cors());
router.use(bodyparser());

router.post('/', uploadController.uploadFile)
router.get('/:apiKey', fetchFile.fetchFile)
router.get('/', (req, res) => res.send('Invalid Page Request'))
router.put('/', (req, res) => res.send('Invalid Page Request'))
router.delete('/:apiKey', deleteFile);

// Our Webpage Using Key....
router.post('/register', registration)
router.get('/register', (req, res) => res.status(404).send('Invalid Page Request'))
router.put('/register', (req, res) => res.status(404).send('Invalid Page Request'))
router.delete('/register', (req, res) => res.status(404).send('Invalid Page Request'))

router.post('/login', accountControl.login);
router.get('/login', (req, res) => res.status(404).send('Invalid Page Request'))
router.put('/login', (req, res) => res.status(404).send('Invalid Page Request'))
router.delete('/login', (req, res) => res.status(404).send('Invalid Page Request'))

router.post('/otpsend', accountControl.otpSend);
router.post('/verify', accountControl.otpVerify);
router.post('/reset', accountControl.passwordUpdate);

router.post('/filedetails', fetchFile.fileDetails);


router.get('/storagedetails/:apiKey', fileListing)
router.get('/storagedetails', (req, res) => res.status(404).send('Invalid Page Request'))
router.post('/storagedetails/:apiKey', (req, res) => res.status(404).send('Invalid Page Request'))
router.post('/storagedetails', (req, res) => res.status(404).send('Invalid Page Request'))




module.exports = router;