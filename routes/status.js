const express = require('express');
const auth = require('../middlewares/isAuth');
const isUser = require('../middlewares/isUser');
const user = require('../helpers/user');
const router = express.Router();

router.post('/status', auth.isAuth, (req, res) => {
  user.changeStatus(req.user.id, req.body.statusDescription).then(status => {
    res.status(200).send({
      status: 200,
      message: 'Status uploaded',
      status: status
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

module.exports = router;