const properties = require('../utilities/properties');
const db = require('../utilities/db');

module.exports.getChats = userId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.manyOrNone(properties.getConversationList, [userId]).then(chats => {
        res(chats);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.getChatById = chatId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.getConversationById, [chatId]).then(chat => {
        res(chat);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.getConversationUsers = chatId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.manyOrNone(properties.getConversationUsers, [chatId]).then(users => {
        res(users);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.isUserParticipant = (userId, chatId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.getUserFromConversation, [chatId, userId]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.createChat = (typeChat, creatorId, chatName, participants) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.task(async t => {
        const chat = await t.one(properties.createConversation, [typeChat, creatorId, chatName]);        
        let users = [];
        users.push(await t.one(properties.insertUserToConversation, [creatorId, 2, chat.conversation_id]));
        
        for (const user in participants) {
          users.push(await t.one(properties.insertUserToConversation, [participants[user], 1, chat.conversation_id]));
        }
        return {chat: chat, users: users};
      }).then(data => {
        res(data);
      }).catch(err => {
        console.log(err);
        rej(err);
      })
        obj.done();
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

module.exports.join = (userId, typeUserId, chatId) => {
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

module.exports.leaveGroup = (userId, chatId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.removeUserFromConversation, [userId, chatId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.getMessages = chatId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.manyOrNone(properties.getMessageList, [chatId]).then((data) => {
        res(data);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

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
}

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
}


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

module.exports.changePermissions = (userId, chatId, permission) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.updateTypeUser, [permission, userId, chatId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

/**
 * TODO: 
 *  Search messages
 *  BlockUser(Query)
 *  UnblockUser(Query)
 *  getConversationUsers(Query)
 * 
 */