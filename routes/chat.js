const express = require('express');
const auth = require('isAuth');
const chat = require('../helpers/chat');
const router = express.Router();

router.get('/chats', auth.isAuth, (req, res) => {
  chat.getChats(req.user.id).then(chats => {
    res.status(200).send({
      status: 200,
      message: 'Conversations Returned',
      chats: chats
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.post('/chats', (req, res) => {
  chat.createChat(req.body.typeChat, req.user.id, req.body.chatName).then(chat => {
    res.status(200).send({
      status: 200,
      message: 'Chat created succesfully',
      chat: chat
    })
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.delete('/chats', (req, res) => {
  chat.deleteChat(req.body.chatId).then(() => {
    res.status(200).send({
      status: 200,
      message: 'Chat Deleted'
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.get('chats/:conversationId/messages', (req, res) => {
  chat.getMessages(req.params.conversationId).then(messages => {
    res.status(200).send({
      status: 200,
      message: 'Messages returned',
      messages: messages
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