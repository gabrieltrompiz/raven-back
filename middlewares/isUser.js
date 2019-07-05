const user = require('../helpers/user');
const chat = require('../helpers/chat');

module.exports.isChatOwner = (req, res, next) => {
  const chatId = typeof req.params.conversationId === 'undefined' ? 
  typeof req.query.chatId === 'undefined' ? req.body.chatId : req.query.chatId : req.params.conversationId;
  
  chat.getChatById(chatId).then(chat => {
    if(chat.creator_id === req.user.id && chat.type_conversation_id !== 1) {
      next();
    } else {
      res.status(403).send({
        status: 403,
        message: 'Unauthorized'
      });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
};

module.exports.isChatParticipant = (req, res, next) => {
  const chatId = typeof req.params.conversationId === 'undefined' ? 
  typeof req.query.chatId === 'undefined' ? req.body.chatId : req.query.chatId : req.params.conversationId;
  
  chat.isUserParticipant(req.user.id, chatId).then(data => {
    if(data === null) {
      res.status(403).send({
        status: 403,
        message: 'User is not participant'
      });
    } else {
      next();
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
}

module.exports.isNotChatParticipant = (req, res, next) => {
  const chatId = typeof req.params.conversationId === 'undefined' ? 
  typeof req.query.chatId === 'undefined' ? req.body.chatId : req.query.chatId : req.params.conversationId;
  
  chat.isUserParticipant(req.user.id, chatId).then(data => {
    if(data !== null) {
      res.status(403).send({
        status: 403,
        message: 'User is not participant'
      });
    } else {
      next();
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
}

module.exports.isStatusOwner = (req, res, next) => {
  const statusId = typeof req.params.conversationId === 'undefined' ? 
  typeof req.query.chatId === 'undefined' ? req.body.statusId : req.query.statusId : req.params.statusId;
  
  user.getStatusById(statusId).then(status => {
    if(status.user_id === req.user.id) {
      next()
    } else {
      res.status(403).send({
        status: 403,
        message: 'Unauthorized'
      });
    }
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      status: 500,
      message: 'Internal Server Error'
    });
  });
}