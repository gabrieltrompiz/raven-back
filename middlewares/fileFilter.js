// const multer = require('multer');

module.exports = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.res.status(409).send("Files must be photos.");
    }
    cb(null, true)
}