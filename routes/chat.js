const express = require('express');
const auth = require('../middlewares/isAuth');
const chat = require('../helpers/chat');
const isUser = require('../middlewares/isUser')
const router = express.Router();
const fs = require('fs');
const config = require('../config.json');

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

// router.post('/chats', auth.isAuth, (req, res) => {
//   chat.createChat(req.body.typeChat, req.user.id, req.body.chatName, req.body.participants).then(chat => {
//     res.status(200).send({
//       status: 200,
//       message: 'Chat created succesfully',
//       data: chat
//     })
//   }).catch(err => {
//     console.log(err);
//     res.status(500).send({
//       status: 500,
//       message: 'Internal Server Error'
//     });
//   });
// });

// router.delete('/chats', auth.isAuth, isUser.isChatOwner, (req, res) => {
//   chat.deleteChat(req.body.chatId).then(() => {
//     res.status(200).send({
//       status: 200,
//       message: 'Chat Deleted'
//     });
//   }).catch(err => {
//     console.log(err);
//     res.status(500).send({
//       status: 500,
//       message: 'Internal Server Error'
//     });
//   });
// });

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

router.post('/upload', auth.isAuth, (req, res) => {
  //base64
  //filename
  fs.writeFile(config.storage_dir + 'conversations/' +  req.body.filename, req.body.base64, 'base64', err => {
    if(err) {
      console.log(err);
      res.status(500).send({
        status: 500,
        message: 'Could not Upload Image'
      })
    } else {
      res.status(200).send({
        status: 200,
        message: 'Image Uploaded',
        data: {
          filePath:  req.body.filename
        }
      })
    }
  });
})

router.get('/upload/:uri', auth.isAuth, (req, res) => {
  let uri = req.params.uri;
  console.log('here')
  res.setHeader("Content-Type", "image/png");
  fs.createReadStream('assets/conversation/' + uri).pipe(res);
})

module.exports = router;