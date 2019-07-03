const properties = require('../utilities/properties');
const user = require('../helpers/user');

module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else{
    res.send({
      status: 403,
      response: 'Not logged in.'
    });
  }
};

module.exports.isLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send({
      status: 403,
      response: 'Already logged in.'
    });
  } else {
    next();
  }
};

//Verifies that the sent email is not registered in db
module.exports.emailRegistered = (req, res, next) => {
  const email = req.query.email;
  user.getUserByEmail(email).then(user => {
    if(user === null)
      next();
    else {
      res.status(403).send({
        status: 403,
        message: 'Email already registered'
      });
    }
  }).catch(err => {
    res.status(500).send({
      status: 500,
      message: 'Internal server error'
    });
  });
};

module.exports.usernameRegistered = (req, res, next) => {
  const username = req.query.username;
  
  user.getUserByUsername(username).then(user => {
    if(user === null) {
      next();
    } else {
      res.status(403).send({
        status: 403,
        message: 'Username already in use'
      });
    }
  });
}