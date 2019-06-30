const db = require('../utilities/db');
const bcrypt = require('bcryptjs');
const properties = require('../utilities/properties');

module.exports.register = user => {
    return new Promise((res, rej) => {
        db.connect().then(obj => {
            obj.one(properties.registerUser, [user.phone, user.name, user.email, '../assets/default.jpg']).then(user => {
                
            })
        })
    });
};