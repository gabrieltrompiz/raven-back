let express = require('express');
let router = express.Router();
let token = require('../utilities/tokens');

router.get('/', (req, res) => {
    res.status(200).send({
        status: 200,
        message: 'ok'
    });
});

router.get('/logout', (req, res) => {
    token.revokeToken(req.body.token);
    res.status(200).send({
        status: 200,
        message: 'Logout'
    })    
})

module.exports = router;