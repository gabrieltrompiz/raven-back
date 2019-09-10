const express = require('express');
const router = express.Router();
const auth = require('../middlewares/isAuth');
const userHelper = require('../helpers/user');
const path = require('path')

const config = require('../config.json');

// const upload = multer({ dest: '../assets/avatars/'})
const fs = require('fs');

router.get('/users', auth.isAuth, (req, res) => {
  const query = req.query.search;
  if(typeof query === 'undefined') {
    res.status(400).send({
      status: 400,
      message: 'Bad Request'
    });
  } else {
    userHelper.searchUsers(query).then(users => {
      let beautifulUsers = [];
      users.forEach(user => {
        beautifulUsers.push({ id: user.user_id, name: user.user_name, email: user.user_email, pictureUrl: user.user_picture_url });
      });

      res.status(200).send({
        status: 200,
        message: 'Users Returned',
        data: beautifulUsers
      });
    }).catch(err => {
      console.log(err);
      res.status(500).send({
        status: 500,
        message: 'Internal server error'
      });
    });
  }
});

router.post('/picture', (req, res) => {
  const uri = req.body.uri;
  // console.log(req.body);
  if(req.body.oldUri !== '') {
    fs.unlink(config.storage_dir + '/avatars/' + req.body.oldUri, err => {
      if(err) console.log(err);
      userHelper.changePictureUrl(req.user.id, uri);
    })
  }
  console.log(uri);
  fs.writeFile(config.storage_dir + '/avatars/' + uri, req.body.base64, 'base64', err => {
    if(err) {
      console.log(err);
      res.status(500).send({
        status: 500,
        message: 'Could not Upload Image'
      })
    } else {
      res.status(200).send({
        status: 200,
        message: 'Image Uploaded'
      })
    }
  });
})

router.get('/picture/:uri', (req, res) => {
  let uri = req.params.uri;
  console.log('here')
  res.setHeader("Content-Type", "image/png");
  fs.createReadStream('assets/avatars/' + uri).pipe(res)
})

module.exports = router;