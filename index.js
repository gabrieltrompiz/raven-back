const props = require('./utilities/properties');

const express = require('express');
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let session = require('express-session');
let passport = require('passport');

// require('./sockets/auth')(io);
require('./sockets/chat')(io);

app.use(express.json());
app.use(express.urlencoded());
app.use(session({
	secret:'keyboard cat',
	resave: false,
	saveUninitialized: false
}));

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