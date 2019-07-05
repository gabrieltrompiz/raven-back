module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    console.log('connected to chat')
    
    io.on('message', message => { //Send and receive messages

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