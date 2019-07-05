const express = require('express');
const user = require('../helpers/user');
const router = express.Router();

router.get('/status', (req, res) => {
  user.getStatusList(req.user.id).then(statusList => {
    res.status(200).send({
      status: 200,
      message: 'Status List returned',
      statusList: statusList
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.post('/status', (req, res) => {
  user.uploadStatus(req.body.oldStatusId, req.user.id, req.body.statusDescription).then(status => {
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

router.put('/status', (req, res) => {
  user.updateStatus(req.body.oldStatusId, req.body.newStatusId).then(() => {
    res.status(200).send({
      status: 200,
      message: 'Status updated'
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.delete('/status', (req, res) => {
  user.deleteStatus(req.body.statusId).then(() => {
    res.status(200).send({
      status: 200,
      message: 'Status deleted'
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
})

module.exports = router;