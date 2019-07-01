const userHelper = require('../helpers/user')
const passport = require('passport');
const token = require('../utilities/tokens');
module.exports = (io) => {
  const nsp = io.of('/auth')
  nsp.on('connection', socket => {
    console.log('connected to auth');

    socket.on('email', email => {
      userHelper.getUserByEmail(email).then(user => {
        if(user) {
          socket.emit('userFound');
        } else {
          socket.emit('userNotFound');
        }
      }).catch(err => {
        socket.emit('serverError', err);
      });
    });

    socket.on('login', (email, password) => {

      userHelper.login(email, password).then(user => {
        if(user) {
          const beautifulUser = {
            id: user.user_id,
            phone: user.user_phone,
            name: user.user_name,
            email: user.user_email,
            pictureUrl: user.user_picture_url,
            creationTime: user.user_creation_time
          };

          socket.emit('logged', {user: beautifulUser, token: token.generateToken(beautifulUser.id)});

        } else {
          socket.emit('notLogged');
        }
      }).catch(err => {
        socket.emit('serverError', err);
      });
    });

    socket.on('sendCode', bool => {

    });

    socket.on('userRegister', user => {
      userHelper.getUserByPhone(user.phone).then(user => {
        if(user) {
          socket.emit('registerFailed', 'Phone Number already registered');
        } else {
          user.password = userHelper.encrypt(user.password);

          userHelper.register(user).then(user => {
            const beautifulUser = {
              id: user.user_id,
              phone: user.user_phone,
              name: user.user_name,
              email: user.user_email,
              pictureUrl: user.user_picture_url,
              creationTime: user.user_creation_time
            };
            socket.emit('registerSuccessful', {user: beautifulUser, token: token.generateToken(beautifulUser.id)});
            
          }).catch(err => {
            socket.emit('serverError', err);
          });

        }
      });
    });

    socket.on('checkCode', code => {
      socket.emit('codeVerification', code === 000001);
    });
  });
}