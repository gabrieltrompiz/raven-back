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

module.exports.register = _user => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.task(async t => {
        const user = await t.one(properties.registerUser, 
          [_user.username, _user.name, _user.email, _user.pictureUrl, _user.password]);
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
      obj.manyOrNone(properties.searchUser, ['%' + query + '%']).then(users => {
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

module.exports.changePictureUrl = (userId, pictureUrl) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.updatePicture, [pictureUrl, userId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  })
}