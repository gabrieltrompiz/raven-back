const db = require('../utilities/db');
const bcrypt = require('bcryptjs');
const properties = require('../utilities/properties');

module.exports.getUserByEmail = email => {
    return new Promise((res, rej) => {
        db.connect().then(obj => {
            obj.one(properties.getUserByEmail, [email]).then(user => {
                res(user);
                obj.done();
            });
        }).catch(err => {
            console.log(err);
            rej(err);
        });
    });
};

module.exports.register = user => {
    return new Promise((res, rej) => {
        db.connect().then(obj => {
            obj.one(properties.registerUser, [user.phone, user.name, user.email, '../assets/default.jpg', user.password]).then(user => {
                res(user);
                obj.done();
            });
        }).catch(err => {
            console.log(err);
            rej(err);
        });
    });
};

module.exports.login = (email, password) => {
    return new Promise((res, rej) => {
        db.connect().then(obj => {
            obj.one(properties.login, [email, password]).then(user => {
                res(user);
                obj.done();
            });
        }).catch(err => {
            console.log(err);
            rej(err);
        });
    });
};

module.export.encrypt = password => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            password = hash;
        });
    });
    return password;
}