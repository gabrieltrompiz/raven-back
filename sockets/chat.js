module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    console.log('connected to chat')
    
    io.on('message', message => {

    });

    io.on('joinGroup', (userId, conversationId) => {

    });

    io.on('leaveGroup', (userId, conversationId) => {

    });
  });
}