const multer = require('multer');
const config = require('../config.json');

module.exports = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, config.storage_dir + '/avatars/');
  },
  filename: (req, file, cb) =>  {
    cb(null, req.body.email + '.png');
  }
});