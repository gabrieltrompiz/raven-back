const chats = require('../helpers/chat');

let chats = {};

//If chat is in room list, send message. If not, create room querying db and adding the users, then send message
checkChat = chatId => {
  if(!chats.hasOwnProperty(chatId)) {
    chats.getConversationUsers(chatId).then(users => {
      let usersId = [];
      users.forEach(user => {
        usersId.push(user.user_id);
      });
      chats[chat.conversation_id] = {
        chatId: users[0].conversation_id,
        participants: usersId
      }
    }).catch(err => {
      console.log(err);
      socket.emit('error', err);
    });
  }
}

module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    console.log('connected to chat')
    
    io.on('message', (chatId, attachment, body) => { //Send and receive messages
      checkChat(chatId);

      //TODO: Revisar antes si el usuario forma parte de la conversacion

      //almacenar el mensaje
      chats.insertMessage(req.handshake.session.id, chatId, attachment, body).then(() => {
        //avisar a los otros sockets
        io.in(chatId).emit('message', attachment, body);
      }).catch(err => {
        socket.emit('error', err);
      })
      
    });

    io.on('deleteMessage', (chatId, messageId) => {
      checkChat(chatId);

      //TODO: Revisar antes si el usuario forma parte de la conversacion

      chats.deleteMessage(messageId).then(() => {
        //avisar a los otros sockets
        io.in(chatId).emit('deleteMessage', attachment, body);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      })
    })

    io.on('joinGroup', (joinerId, chatId) => {
      checkChat(chatId);

      //Revisar si el usuario forma parte de la conversacion y si es admin

      //Revisar si el joiner no está ya en el grupo

      chats.joinGroup(joinerId, 1, chatId).then(user => {
        io.in(chatId).emit('joinGroup', user);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      });
    });

    io.on('leaveGroup', chatId => {
      checkChat(chatId);

      //Revisar si el usuario forma parte de la conversacion (??)
      
      chats.leaveGroup(req.handshake.session.id, chatId).then(() => {
        io.in(chatId).emit('leaveGroup', user);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      });
    });

    io.on('kick', (kickedId, chatId) => {
      checkChat(chatId);

      //Revisar si el usuario forma parte de la conversacion y si es admin

      //Revisar si el kicked forma parte del grupo

      chats.leaveGroup(kickedId, chatId).then(() => {
        io.in(chatId).emit('leaveGroup', user);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      });
    })

    io.on('search', query => {

    });
  });
}

//TODO: add helper to create rooms with conversations