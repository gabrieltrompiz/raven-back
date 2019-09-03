const props = require('./utilities/properties');

const express = require('express');
const app = express();
const siofu = require('socketio-file-upload');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let session = require('express-session');
let passport = require('passport');
let cors = require('cors');

const sessionMiddleware = session({
	secret:'keyboard cat',
	resave: true,
	saveUninitialized: true
})


require('./sockets/chat')(io, sessionMiddleware);
require('./sockets/profile')(io);

app.use(express.json());
app.use(express.urlencoded());
app.use(sessionMiddleware);

app.use(siofu.router);

app.use(cors({
  origin: true,
  methods: 'POST, PUT, GET, DELETE, OPTIONS',
  allowedHeaders: 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization',
  credentials: true
}))

app.use(passport.initialize());
app.use(passport.session());

app.use( '/', require('./routes/index'));

passport.use(require('./helpers/localStrategy'));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

http.listen(props.port, () => {
  console.log('Listening on port ' + props.port);
});