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
          [userData.username, userData.name, userData.email, userData.pictureUrl === undefined ? '../assets/default.jpg': userData.pictureUrl, userData.password]);
        const status = await t.one(properties.initializeStatus, [user.user_id]);
        return {user: user, status: status}
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

module.exports.getStatusList = userId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.manyOrNone(properties.getStatusList, [userId]).then(statusList => {
        res(statusList);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.getStatusById = statusId => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.getStatusById, [statusId]).then(status => {
        res(status);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
}

module.exports.uploadStatus = (oldStatusId, userId, statusDescription) => {    //CHECK IF THIS QUERY WORKS
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.one(properties.uploadStatus, [oldStatusId, userId, statusDescription]).then(status => {
        res(status);
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.updateStatus = (oldStatusId, newStatusId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.updateStatus, [oldStatusId, newStatusId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

module.exports.deleteStatus = (statusId) => {
  return new Promise((res, rej) => {
    db.connect().then(obj => {
      obj.none(properties.deleteStatus, [statusId]).then(() => {
        res();
        obj.done();
      });
    }).catch(err => {
      console.log(err);
      rej(err);
    });
  });
};

/**
 * TODO:
 *  Check if db.none is ok for uploadStatus method and deleteStatus
 */