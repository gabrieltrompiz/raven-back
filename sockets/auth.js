module.exports = (io) => {
  const nsp = io.of('/auth')
  nsp.on('connection', socket => {
    console.log('connected to auth');

    socket.on('email', email => {

    });

    socket.on('password', password => {

    });

    socket.on('registerQuestion', bool => {

    });

    socket.on('userRegister', user => {

    });

    socket.on('checkCode', () => {

    });
  });
}