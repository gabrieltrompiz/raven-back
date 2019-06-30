const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendStatus(200)
})

require('./sockets/auth')(io)
require('./sockets/chat')(io)

http.listen(8080, () => {
  console.log('Listening on port 8080')
})