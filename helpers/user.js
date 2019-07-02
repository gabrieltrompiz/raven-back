const db = require('../utilities/db');
const bcrypt = require('bcryptjs');
const properties = require('../utilities/properties');

module.exports.getUserByEmail = email => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.getUserByEmail, [email]).then(user => {
        console.log(email)
        console.log("user" + user)
        res(user);
        obj.done();
      }).catch(err => {
        rej(err);
      })
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.getUserByPhone = phone => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.getUserByPhone, [phone]).then(user => {
        res(user);
        obj.done();
      }).catch(err => {
        rej(err);
      })
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.register = user => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.registerUser, [user.name, user.email, '../assets/default.jpg', user.password]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  }).catch(err => {
    console.log(err);
    rej(err);
  })
};

module.exports.login = (email, password) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.login, [email, password]).then(user => {
        res(user);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.comparePassword = (candidate, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(candidate, hash, (err, isMatch) => {
      if(err) rej(err);
        res(isMatch);
    })
  })
}