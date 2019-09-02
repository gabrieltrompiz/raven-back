const db = require('../utilities/db');
const bcrypt = require('bcryptjs');
const properties = require('../utilities/properties');

module.exports.getUserByEmail = email => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.getUserByEmail, [email]).then(user => {
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

module.exports.getUserByUsername = username => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.oneOrNone(properties.getUserByUsername, [username]).then(user => {
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

module.exports.register = userData => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.task(async t => {
        const user = await t.one(properties.registerUser, 
          [userData.username, userData.name, userData.email, userData.pictureUrl === undefined ? '../assets/default.png': userData.pictureUrl, userData.password]);
        return user;
      }).then(data => {
        res(data);
      }).catch(err => {
        console.log(err);
        rej(err);
      });
      obj.done();
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  }).catch(err => {
    console.log(err);
    rej(err);
  })
};

module.exports.comparePassword = (candidate, hash) => {
  return new Promise((res, rej) => {
    bcrypt.compare(candidate, hash, (err, isMatch) => {
      if(err) rej(err);
        res(isMatch);
    })
  })
}

module.exports.searchUsers = query => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.manyOrNone(properties.getUsersByUsername, ['%' + query + '%']).then(users => {
        res(users);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.updateProfile = (name, username, userId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.updateUser, [name, username, userId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.changeStatus = (userId, status) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.changeUserStatus, [status, userId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  })
}