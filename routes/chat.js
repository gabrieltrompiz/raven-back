const express = require('express');
const auth = require('../middlewares/isAuth');
const chat = require('../helpers/chat');
const isUser = require('../middlewares/isUser')
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

router.post('/chats', auth.isAuth, (req, res) => {
  chat.createChat(req.body.typeChat, req.user.id, req.body.chatName, req.body.participants).then(chat => {
    res.status(200).send({
      status: 200,
      message: 'Chat created succesfully',
      data: chat
    })
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
});

router.delete('/chats', auth.isAuth, isUser.isChatOwner, (req, res) => {
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

router.get('/chats/:conversationId/messages', auth.isAuth, isUser.isChatParticipant, (req, res) => {
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