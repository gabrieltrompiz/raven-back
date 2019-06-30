const props = require('./utilities/properties');

const app = require('express')();
const http = require('http').createServer(app)
const io = require('socket.io')(http)

require('./sockets/auth')(io)
require('./sockets/chat')(io)

app.use(express.json());
app.use(express.urlencoded());

app.use( '/', require('./routes/index'));

http.listen(props.port, () => {
  console.log('Listening on port ' + props.port);
});