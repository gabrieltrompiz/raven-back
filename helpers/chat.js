const properties = require('../utilities/properties');

module.exports.getChats = userId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.many(properties.getConversationList, [userId]).then(chats => {
        res(chats);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.createChat = (typeChat, creatorId, chatName) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.createConversation, [typeChat, creatorId, chatName]).then(chat => {
        res(chat);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.deleteChat = (chatId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.deleteConversation, [chatId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.insertMessage = (userId, chatId, attachment, body) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.insertMessage, [userId, chatId, attachment, body]).then(message => {
        res(message);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.deleteMessage = (messageId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.deleteMessage, [messageId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.joinGroup = (userId, typeUserId, chatId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.insertUserToConversation, [userId, typeUserId, chatId]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.leaveGroup = (userId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.removeUserFromConversation, [userId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.blockUser = (blockerId, blockedId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.blockUser, [blockerId, blockedId]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.unblockUser = (blockerId, blockedId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.unblockUser, [blockerId, blockedId]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

/**
 * TODO: 
 *  Search messages
 *  BlockUser(Query)
 *  UnblockUser(Query)
 *  getConversationUsers(Query)
 * 
 */