module.exports = (io) => {
  const nsp = io.of('/auth')
  nsp.on('connection', socket => {
    console.log('connected to auth')
  })
}