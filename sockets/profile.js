const fs = require('fs');
const siofu = require("socketio-file-upload");
const config = require('../config.json');
const userHelper = require('../helpers/user');

module.exports = (io) => {
  const nsp = io.of('/profile');
  nsp.on('connection', socket => {
    var uploader = new siofu();
    uploader.dir = config.storage_dir + '/avatars';
    
    uploader.listen(socket);
    
    uploader.on('saved', e => {
      if(e.file.success) {
        console.log('File uploaded')
      } else {
        console.log('Error uploading');
      }
    })

    uploader.on('error', e => {
      console.log('Error from uploader: ' + e);
    });

    socket.on('updateProfile', (name, username) => {
      userHelper.updateProfile(name, username).then(() => {
        io.emit('updateProfile', (name, username, /*id del usuario */socket.handshake.session.id));
      }).catch(err => {
        socket.emit('error', err);
      })
    })
  
    socket.on('deletePicture', () => {
      fs.unlink(config.storage_dir + '/avatars/' + socket.handshake.session.id + '.png', err => {
        if (err) socket.emit('error', err);
        else socket.emit('deletePicture');
      });
    });

    socket.on('search', query => {
      userHelper.searchUsers(query).then(users => {
        let beautifulUsers = [];
        users.forEach(user => {
          beautifulUsers.push({ id: user.user_id, name: user.user_name, email: user.user_email, 
            pictureUrl: user.user_picture_url, status: user.user_status, username: user.user_username });
        });
        socket.emit('search', users);
      }).catch(err => socket.emit('error'));
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from profile edit');
      socket.leaveAll();
    })

  })
}