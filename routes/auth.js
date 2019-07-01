let express = require('express');
let router = express.Router();
const passport = require('passport');
const auth = require('../middlewares/isAuth');
const userHelper = require('../helpers/user');
const bcrypt = require('bcryptjs');

router.get('/email', auth.isLogged, (req, res) => { 
    userHelper.getUserByEmail(req.query.email).then(user => {
      res.status(202).send({
        status: 202,
        message: 'Email found'
      });
      console.log('XD');

      }).catch(err => {
        console.log('XD2');
        res.status(500).send({
            status: 200,
            message: 'User does not exists'
        });
      });
});

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

router.post('/register', auth.isLogged, /*user.emailExists, user.phoneExists*/ (req, res) => {
    let user = req.body;
    console.log(user);
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    
    userHelper.register(user).then(data => {
      req.login(data, err => {});
      res.status(200).send({
        status: 200,
        message: 'User registered succesfully',
        data: {
          id: data.user_id,
          phone: data.user_phone,
          name: data.user_name,
          email: data.user_email,
          pictureUrl: data.user_picture_url,
          creationTime: data.user_creation_time
        }
    });
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: 'Internal server error'
  });
  })
});

router.get('/sendCode', (req, res) => {

})

router.get('/checkCode', (req, res) => {
    if(req.body.code === 000001) {
        res.status(202).send({
            status: 202,
            message: 'Code Matched',
        });
    } else {
        res.status(406).send({
            status: 406,
            message: 'Code doesn\'n match'
        });
    }
});

module.exports = router;