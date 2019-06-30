module.exports = (io) => {
  const nsp = io.of('/chat')
  nsp.on('connection', socket => {
    console.log('connected to chat')
  })
}