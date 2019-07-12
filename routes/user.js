const express = require('express');
const router = express.Router();
const auth = require('../middlewares/isAuth');
const userHelper = require('../helpers/user');

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

router.put('/users', auth.isAuth, (req, res) => {
  
})

module.exports = router;