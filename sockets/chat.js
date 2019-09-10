const chatHelper = require('../helpers/chat');
const userHelper = require('../helpers/user');

module.exports = (io, sessionMiddleware) => {
  const sockets = new Map()
  const pendingMessages = {}
  const pendingGroups = {}
  const pendingChannels = {}
  const groups = {}
  const channels = {}

  const nsp = io.of('/chat')

  nsp.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next)
  })

  nsp.on('connection', socket => {
    if(typeof socket.request.session.passport === 'undefined') {
      socket.emit('relog', 'not logged')
      return;
    } else {
      const user = socket.request.session.passport.user
      console.log(user.username + ' connected')
      sockets.set(user.id, socket)

      if(pendingMessages.hasOwnProperty(user.id)) {
        for(message of pendingMessages[user.id]) {
          socket.emit('message', message)
          console.log(message)
        }
        delete pendingMessages[user.id]
      }

      if(pendingGroups.hasOwnProperty(user.id)) {
        for(group of pendingGroups[user.id]) {
          socket.emit('added to group', group)
        }
        delete pendingGroups[user.id]
      }

      if(pendingChannels.hasOwnProperty(user.id)) {
        for(channel of pendingChannels[user.id]) {
          socket.emit('added to channel', channel)
        }
        delete pendingChannels[user.id]
      }
      
      socket.on('message', (message) => { //Send and receive messages
        console.log(message)
        message.user = user
        message.time = Date.now()
        if(message.type === 1) {
          if(sockets.has(message.to)) {
            sockets.get(message.to).emit('message', message)
          } else if(pendingMessages.hasOwnProperty(message.to)) {
            pendingMessages[message.to].push(message)
          } else {
            pendingMessages[message.to] = [message]
          }
        } else {
          if(groups.hasOwnProperty(message.to)) {
            for(participant of groups[message.to].users) {
              if(participant.user_id !== user.id) {
                if(sockets.has(participant.user_id)) {
                  sockets.get(participant.user_id).emit('message', message)
                } else if(pendingMessages.hasOwnProperty(participant.user_id)) {
                  pendingMessages[participant.user_id].push(message)
                } else {
                  pendingMessages[participant.user_id] = [message]
                }
              }
            }
          } else {
            chatHelper.getChatById(message.to).then(conv => {
              chatHelper.getConversationUsers(message.to).then(users => {
                const groupData = {
                  id: message.to,
                  type: 2,
                  name: conv.conversation_id,
                  creator: conv.creator_id, 
                  users: users
                }
                groups[message.to] = groupData
                for(participant of groups[message.to].users) {
                  if(participant.user_id !== user.id) {
                    if(sockets.has(participant.user_id)) {
                      sockets.get(participant.user_id).emit('message', message)
                    } else if(pendingMessages.hasOwnProperty(participant.user_id)) {
                      pendingMessages[participant.user_id].push(message)
                    } else {
                      pendingMessages[participant.user_id] = [message]
                    }
                  }
                }
              })
            })
          }
        }
      });

      socket.on('create group', (group) => {
        chatHelper.createChat(2, user.id, group.name, group.participants)
        .then(data => {
          const groupData = {
            id: data.chat.conversation_id,
            type: 2,
            name: data.chat.conversation_name,
            creationDate: Date.now(),
            creator: user,
            users: data.users
          }
          groups[groupData.id] = groupData
          socket.emit('created group', groupData)
          for(participant of group.participants) {
            if(sockets.has(participant)) {
              sockets.get(participant).emit('added to group', groupData)
            } else if(pendingGroups.hasOwnProperty(participant)) {
              pendingGroups[participant].push(groupData)
            } else {
              pendingGroups[participant] = [groupData]
            }
          }
        })
      })

      socket.on('create channel', (channel) => {
        chatHelper.createChat(3, user.id, channel.name, channel.participants)
        .then(data => {
          const channelData = {
            id: data.chat.conversation_id,
            type: 3,
            name: data.chat.conversation_name,
            creationDate: Date.now(),
            creator: user,
            users: data.users
          }
          channels[channelData.id] = channelData
          socket.emit('created channel', channelData)
          for(participant of channel.participants) {
            if(sockets.has(participant)) {
              sockets.get(participant).emit('added to channel', channelData)
            } else if(pendingChannels.hasOwnProperty(participant)) {
              pendingChannels[participant].push(channelData)
            } else {
              pendingChannels[participant] = [channelData]
            }
          }
        })
      })
      
      socket.on('disconnect', () => {
        sockets.delete(user.id)
        socket.leaveAll();
      })
    }
  });
}

//TODO: add helper to create rooms with conversations