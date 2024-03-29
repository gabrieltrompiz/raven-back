const express = require('express');
const router = express.Router();

const passport = require('passport');
const auth = require('../middlewares/isAuth');
const userHelper = require('../helpers/user');
const bcrypt = require('bcryptjs');
const codeManager = require('../helpers/codeManager');
const properties = require('../utilities/properties');

const diskStorage = require('../utilities/diskStorage');
const fileFilter = require('../middlewares/fileFilter');
const config = require('../config.json');

const multer = require('multer');
const upload = multer({ storage: diskStorage, fileFilter: fileFilter });
// const upload = multer({ dest: '../assets/avatars/'})
const fs = require('fs');

const transporter = require('nodemailer').createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: properties.emailUser,
    pass: properties.emailPass
  }
});

router.get('/checkUser', auth.isLogged, auth.usernameRegistered, (req, res) => { 
  res.status(200).send({
    status: 200,
    message: 'Ok'
  })
});

router.get('/checkEmail', auth.isLogged, auth.emailRegistered, (req, res) => {
  res.status(200).send({
    status: 200,
    message: 'Ok'
  })
})

router.post('/login', auth.isLogged, passport.authenticate('local'), (req, res) => {
  res.status(200).send({
    status: 200,
    message: "Logged in successfully.",
    user: req.user
  });
});

router.get('/logout', auth.isAuth, (req, res) => {
  req.logout();
  res.status(200).send({ status: 200, message: "Logged out successfully" });
});

router.post('/register', upload.single('avatar'), auth.isLogged, auth.emailRegistered, auth.usernameRegistered, (req, res) => {
  const user = req.body;
  if(!user.token) { user.token = "" }
  if(!codeManager.checkToken(user.email, user.token)) {
    res.status(401).send({ status: 401, message: 'Invalid register token for given email' })
  } else {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    
    userHelper.register(user).then(data => {
      res.status(200).send({
        status: 200,
        message: 'User registered succesfully',
        user: {
          id: data.user_id,
          username: data.user_username,
          name: data.user_name,
          email:data.user_email,
          pictureUrl: data.user_picture_url,
          creationTime: data.user_creation_time
        }
      });
      
    }).catch(err => {
      fs.unlink(config.storage_dir + '/avatar/' + req.body.id + '.png', er => console.log(er));

      console.log(err);
      res.status(500).send({
        status: 500,
        message: 'Internal server error'
      });
    });
  }
});

router.post('/sendCode', auth.emailRegistered,  (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const code = codeManager.generateCode(email);
  console.log(email + ": " + code)
  res.status(200).send({
    status: 200
  })
  // transporter.sendMail({
  //   from: properties.emailUser,
  //   to: email,
  //   subject: 'Verify your email account',
  //   text: 'Hello, ' + name + ', here\'s your verification code: ' + code,
  //   html: '<p><h1>Hello, ' + name + '. </h1><h4>Here\'s your verification code: <b>' + code +'</b></h4></p>'
  // }).then(data => {
  //   res.status(200).send({
  //     status: 200,
  //     message: 'Mail Sended',
  //     data: data
  //   });
  // }).catch(err => {
  //   res.status(500).send({
  //     status: 500,
  //     message: 'Couldn\'t send Mail'
  //   });
  // })
})

router.get('/checkCode', async (req, res) => {
  const code = req.query.code;
  const email = req.query.email;
  if(codeManager.accept(email, code)) {
    const token = await codeManager.generateToken(email)
    res.status(200).send({
      status: 200,
      message: 'Code Matched',
      token: token
    });
  }
  else {
    res.status(401).send({
      status: 401,
      message: 'Code doesn\'t match' 
    })
  }
});

module.exports = router;