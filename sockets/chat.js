const chats = require('../helpers/chat');
const userHelper = require('../helpers/user');

let connectedUsers = {}; //socket.handshake.session.id: socket.id
let pending = {} //userId: { ...chatId: {messages: [], events: [] }}

setPending = (userId, chatId, message, event)  => { //El event son los eventos de creación de chat, de kick, de lo que sea pues
  if(!userId[chatId].hasOwnProperty(messages)) {
    userId[chatId].messages = [];
  }
  userId[chatId].messages.push(message);

  if(!userId[chatId].hasOwnProperty(events)) {
    userId[chatId].events = [];
  }
  userId[chatId].events.push(event)
}

joinSockets = (usersIds, room) => {
  let connUsers = [];
  for (const i in usersIds) {
    if(connectedUsers.hasOwnProperty(usersIds[i])) {
      io.sockets[connectedUsers[usersId[i]]].join(room);
    }
  }
}

module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    connectedUsers[socket.id] = socket.handshake.session.id;  //Entrar al objeto de sockets conectados
    
    //Revisar pending
    if(pending.hasOwnProperty(socket.handshake.session.id)) {
      socket.emit('pendingQueue', pending[socket.handshake.session.id]);
      delete pending[socket.handshake.session.id];
    }

    console.log('User connected to chat: ' + socket.handshake.session);

    socket.on('createChat', (typeChat, chatName, participants) => { //Participants son los ids de los participantes nada más
      chats.createChat(typeChat, socket.handshake.session.id, chatName, participants).then(chatData => {
        socket.join(chatData.conversation_id);

        const readyUsers = joinSockets(participants, chatData.conversation_id);  //Le paso los ids y me devuelve los ids que se encontraron conectados
        for (const user in participants) {  //Poner en pendiente a todos los usuarios del chat que no se encontraron
          if(!readyUsers.includes(participants[user])) {  //Si no se encontró se le settea el pending
            setPending(participants[user], chatData.conversation_id, null, 'createChat');
          }
        }
        
        io.in(chatData.conversation_id).emit('createChat', chatData);
      }).catch(err => {
        console.log(err);
        socket.emit('error', err);
      });
    });

    socket.on('message', (chatId, attachment, body) => {
      chats.isUserParticipant(socket.handshake.session.id, chatId).then(chat => {
        if(chat) {
          chats.getConversationUsers(chatId).then(users => {
            chats.insertMessage(socket.handshake.session.id, chatId, attachment, body).then(() => {
              let ids = [];
              users.forEach(i => {
                ids.push(i.user_id);
              })
              const readyUsers = joinSockets(ids);
              for (const user in users) {  //Poner en pendiente a todos los demás usuarios del chat
                if(users[user].user_id !== socket.handshake.session.id || !readyUsers.includes(participants[user])) {
                  setPending(users[user].user_id, chatId, { body: body, attachment: attachment }, null);
                }
              }
              
              io.in(chatId).emit('message', attachment, body);
            }).catch(err => socket.emit('error', err));
          })
          socket.join(chatId);
        } else {
          socket.emit('accessDenied', 'Chat does not exists or user is not participant');
        }
      })
    })

    socket.on('deleteMessage', (chatId, messageId) => {
      chats.getMessageById(messageId).then(message => {
        if(message.user_id !== socket.handshake.session.id || message.conversation_id !== chatId) {
          socket.emit('accessDenied', 'You are not the message owner or the specified chat is wrong');
        } else {
          chats.isUserParticipant(socket.handshake.session.id, chatId).then(user => {
            if(user) {
              socket.join(chatId);
              chats.getConversationUsers(chatId).then(users => {
                chats.deleteMessage(messageId).then(() => { //TODO:
                  //Poner en pendiente a todos los demás usuarios del chat
                  //Buscar los demás usuario de la conversación por los sockets y meterlos al room
                  io.in(chatId).emit('deleteMessage', attachment, body);
                }).catch(err => socket.emit('error', err));
              }).catch(err => socket.emit('error', err));
            } else {
              socket.emit('accessDenied', 'You are no longer part of the conversation');
            }
          }).catch(err => socket.emit('error', err));
        }
      }).catch(err => socket.emit('error', err));
    });

    socket.on('join', (joinerId, chatId) => {
      chats.isUserParticipant(socket.handshake.session.id, chatId).then(user => {
        if(user) { //Si forma parte de la conversación
          if(user.type_user_id === 2) {  //Si es admin
            //Revisar que el usuario no esté en la conversación para no meterlo dos veces
            chat.getConversationUsers(chatId).then(users => {
              if (users.includes(joinerId)) { //Esto no va a funcionar. Revisar si el usuario está ya dentro de la conversación
                socket.emit('accessDenied', 'Already into the specified conversation');
              } else {
                socket.join(chatId);
                chats.join(joinerId, 1, chatId).then(user => {
                  //Hacerle socket.join al socket del mamawebo que entró
                  //Poner en pendiente a los demás
                  //Buscar los demás usuario de la conversación por los sockets y meterlos al room
                  io.in(room).emit('join', user);
                }).catch(err => {
                  socket.emit('error', err);
                });
              }
            }).catch(err => {
              socket.emit('error', err);
            });
          } else {
            socket.emit('accessDenied', 'You are not admin')
          }
        } else {
          socket.emit('accessDenied', 'You are not participant of this conversation')
        }
      })
    });

    socket.on('leave', chatId => {
      chats.isUserParticipant(socket.handshake.session.id).then(user => {
        if(user) {
          chats.leaveGroup(socket.handshake.session.id, chatId).then(() => {
            //Poner en pendiente a los demás
            //Buscar los demás usuario de la conversación por los sockets y meterlos al room
            socket.leave(chatId);
            io.in(chatId).emit('leaveGroup', user);
          }).catch(err => socket.emit('error', err));
        } else {
          socket.emit('accessDenied', 'You are not a conversation participant');
        }
      }).catch(err => socket.emit('error', err));

      //Revisar si el chat quedó vacío. De ser así, se borra con una query y se saca de la lista de rooms
      // checkIfEmpty(chatId)
    });

    socket.on('kick', (kickedId, chatId) => {
      checkChat(chatId);

      chats.isUserParticipant(socket.handshake.session.id, chatId).then(user => {
        if(user) {
          if(user.type_user_id === 2) {
            chats,isUserParticipant(kickedId, chatId).then(user => {
              if(user) {
                chats.leaveGroup(kickedId, chatId).then(() => {
                  //Poner en pendiente a los demás
                  //Buscar los demás usuario de la conversación por los sockets y meterlos al room
                  //Hacerle socket.leave al mamawebo que botaron
                  io.in(chatId).emit('kick', kickedId);
                }).catch(err => socket.emit('error', err));
              } else {
                socket.emit('accessDenied', 'User is not participant');
              }
            }).catch(err => socket.emit('error', err));
          } else {
            socket.emit('accessDenied', 'You are not an admin');
          }
        } else {
          socket.emit('accessDenied', 'You are not participant');
        }
      }).catch(err => socket.emit('error', err));
    })

    socket.on('deleteChat', (chatId) => {
      chats.getChatById(chatId).then(chat => {
        if(chat.creator_id === socket.handshake.session.id) {
          chats.deleteChat(chatId).then(() => {
            //Borrar los pending relacionados al chat
            //Hacer room.leaveAll
            socket.emit('deleteChat', 'Chat Deleted');
          }).catch(err => socket.emit('error', err));
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
      }).catch(err => socket.emit('error'));
    });

    socket.on('changePermissions', (userId, chatId, permission) => {
      chat.isUserParticipant(socket.handshake.session.id, chatId).then(user => {
        if(user) {
          if(user.type_user_id === 2) {
            chat.isUserParticipant(userId, permission).then(user => {
              if(user) {
                chats.changePermissions(userId, chatId, permission).then(() => {
                  //Crear la room y meter a todos los sockets que esten conectados
                  //Poner a los demás usuarios del chat pendientes del evento
                  io.in(chatId).emit('changePermissions', userId);
                }).catch(err => socket.emit('error', err));
              } else {
                socket.emit('accessDenied', 'User is not participant')
              }
            }).catch(err => socket.emit('error', err));
          } else {
            socket.emit('accessDenied', 'You are not admin')
          }
        } else {
          socket.emit('accessDenied', 'You are not participant')
        }
      }).catch(err => socket.emit('error', err));
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected.')
      delete connectedUsers[socket.handshake.session.id];
      socket.leaveAll();
    })
  });
}

//TODO: add helper to create rooms with conversations