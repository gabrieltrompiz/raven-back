var codes = {};

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

evalCode = async (email) => {
    try {
        setTimeout(() => {
            if(codes.hasOwnProperty(email))
                delete codes[email];
        }, 120000);
    } catch (e) {
        console.log('oh no');
        console.log(e);
    }
    console.log(codes);
}