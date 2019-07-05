const express = require('express');
const router = express.Router();

router.use('/', require('./auth'));
router.use('/', require('./chat'));
router.use('/', require('./status'));

router.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    message: 'ok'
  });
});

module.exports = router;

/**
 * 
 * TODO:
 *  Chats CRUD (not modify)
 *  Single Chat Messages CRUD (not modify)
 *  Search Users
 *  Create rooms with chats (and initialize them when server starts running)
 * 
 */