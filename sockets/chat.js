const chats = require('../helpers/chat');
const userHelper = require('../helpers/user');

let chat = {};

//If chat is in room list, send message. If not, create room querying db and adding the users, then send message
checkChat = chatId => {
  if(!chat.hasOwnProperty(chatId)) {
    chats.getConversationUsers(chatId).then(users => {
      let usersId = [];
      users.forEach(user => {
        usersId.push(user.user_id);
      });
      chat[chat.conversation_id] = {
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
    
    socket.on('message', (chatId, attachment, body) => { //Send and receive messages
      checkChat(chatId);

      if(chat[chatId].participants.indexOf(socket.handshake.session.id) === -1) {
        socket.emit('accessDenied', 'You are not participant of this conversation')
      } else {
        chats.insertMessage(socket.handshake.session.id, chatId, attachment, body).then(() => {
          io.in(chatId).emit('message', attachment, body);
        }).catch(err => {
          socket.emit('error', err);
        });
      }
      
    });

    socket.on('deleteMessage', (messageId) => {
      checkChat(chatId);

      if(chat[chatId].participants.indexOf(socket.handshake.session.id) === -1) {
        socket.emit('accessDenied', 'You are not participant of this conversation');
      } else {

        chats.getMessageById(messageId).then(message => {
          if(message.user_id === socket.handshake.session.id) {
            chats.deleteMessage(messageId).then(() => {
              io.in(chatId).emit('deleteMessage', attachment, body);
            }).catch(err => {
              console.log(err);
              socket.emit('error', err);
            });

          } else {
            socket.emit('accessDenied', 'You are not the owner of this message');
          }
        }).catch(err => {
          console.log(err);
          socket.emit('error', err);
        })
      }
    })

    socket.on('joinGroup', (joinerId, chatId) => {
      checkChat(chatId);

      userHelper.getUserFromConversation(chatId, socket.handshake.session.id).then(user => {
        if(user) {
          if(user.type_user_id === 2) {
            if(chat[chatId].participants.indexOf(joinerId) === -1) {
              
              chats.joinGroup(joinerId, 1, chatId).then(user => {
                io.in(chatId).emit('joinGroup', user);
              }).catch(err => {
                console.log(err);
                socket.emit('error', err);
              });

            } else {
              socket.emit('accessDenied', 'The user is already in the chat');
            }
          } else {
            socket.emit('accessDenied', 'You are not admin')
          }
        } else {
          socket.emit('accessDenied', 'You are not participant of this conversation')
        }
      })
    });

    socket.on('leaveGroup', chatId => {
      checkChat(chatId);

      if(chat[chatId].participants.indexOf(socket.handshake.session.id) === -1) {

      } else {
        chats.leaveGroup(socket.handshake.session.id, chatId).then(() => {
          io.in(chatId).emit('leaveGroup', user);
        }).catch(err => {
          console.log(err);
          socket.emit('error', err);
        });
      }

      //Revisar si el chat quedó vacío. De ser así, se borra con una query y se saca de la lista de rooms
      // checkIfEmpty(chatId)
    });

    socket.on('kick', (kickedId, chatId) => {
      checkChat(chatId);

      userHelper.getUserFromConversation(chatId, socket.handshake.session.id).then(user => {
        if(user) {
          if(user.type_user_id === 2) {
            if(chat[chatId].participants.indexOf(joinerId) === -1) {
              socket.emit('accessDenied', 'The user is not in chat');
            } else {

              chats.leaveGroup(kickedId, chatId).then(() => {
                io.in(chatId).emit('leaveGroup', user);
              }).catch(err => {
                console.log(err);
                socket.emit('error', err);
              });

            }
          } else {
            socket.emit('accessDenied', 'You are not admin')
          }
        } else {
          socket.emit('accessDenied', 'You are not participant of this conversation')
        }
      })

    })

    
    socket.on('createChat', (typeChat, chatName, participants) => {
      chats.createChat(typeChat, socket.handshake.session.id, chatName, participants).then(chatData => {
        chat[chatData.conversation_id] = {
          participants: participants
        }
        io.in(chatId).emit('createChat', chatData);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      })
    });

    socket.on('deleteChat', (chatId) => {
      //Revisar si el usuario es dueño del chat

      chats.getChatById(chatId).then(chat => {
        if(chat.creator_id === socket.handshake.session.id) {
          chats.deleteChat(chatId).then(() => {
            delete chat[chatId];
            socket.emit('deleteChat', 'Chat Deleted');
          }).catch(err => {
            console.log(err);
            socket.emit('error', err);
          })
        } else {
          socket.emit('accessDenied', 'You are not owner of this conversation');
        }
      })

    })

    socket.on('search', query => {

      userHelper.searchUsers(query).then(users => {
        let beautifulUsers = [];
        users.forEach(user => {
          beautifulUsers.push({ id: user.user_id, name: user.user_name, email: user.user_email, pictureUrl: user.user_picture_url });
        });
        socket.emit('search', users);

      }).catch(err => {
        console.log(err);
        socket.emit('error');
      });
    });

    socket.on('changePermissions', (userId, chatId, permission) => {
      checkChat(chatId);

      //check if user is participant and admin
      userHelper.getUserFromConversation(chatId, socket.handshake.session.id).then(user => {
        if(user) {
          if(user.type_user_id === 2) {
            if(chat[chatId].participants.indexOf(userId) !== -1) {
              
              chats.changePermissions(userId, chatId, permission).then(() => {
                io.in(chatId).emit('changePermission', permission === 2 ? 'User is not an admin' : 'User is not an admin anymore');
              }).catch(err => {
                console.log(err);
                socket.emit('error', err);
              });

            } else {
              socket.emit('accessDenied', 'The user is not participant');
            }
          } else {
            socket.emit('accessDenied', 'You are not admin')
          }
        } else {
          socket.emit('accessDenied', 'You are not participant of this conversation')
        }
      })
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected. Plastemierda')
      socket.leaveAll();
    })
  });
}

//TODO: add helper to create rooms with conversations