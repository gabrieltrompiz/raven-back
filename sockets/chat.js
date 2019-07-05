let chats = {};

module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    console.log('connected to chat')
    
    io.on('message', (userId, chatId, attachments, body) => { //Send and receive messages
      //If chat is in room list, send message. If not, create room querying db and adding the users, then send message
    });

    io.on('deleteMessage', message => {

    })

    io.on('joinGroup', (userId, conversationId) => {

    });

    io.on('leaveGroup', (userId, conversationId) => {

    });

    io.on('search', query => {

    });
  });
}

//TODO: add helper to create rooms with conversations