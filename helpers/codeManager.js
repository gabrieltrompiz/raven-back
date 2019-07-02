const crypto = require('crypto')

let codes = {};
let tokens = {};

module.exports.generateCode = email => {
  if(codes.hasOwnProperty(email))
    return codes[email];
  else {
    codes[email] = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
      + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    evalCode(email);
    console.log(codes);
    return codes[email];
  }
}

module.exports.accept = (email, code) => {
  if(codes[email] === code) {
    delete codes[email];
    return true;
  } else {
    return false;
  }
}

module.exports.generateToken = (email) => {
  return new Promise((res, rej) => {
    crypto.randomBytes(32, (err, buffer) => {
      tokens[email] = buffer.toString('hex')
      res(buffer.toString('hex'))
    })
  })
}

module.exports.checkToken = (email, token) => {
  if(tokens[email] === token) {
    delete tokens[email]
    return true
  } else {
    return false;
  }
}

evalCode = async (email) => {
  setTimeout(() => {
    if(codes.hasOwnProperty(email))
      delete codes[email];
  }, 600000);
}