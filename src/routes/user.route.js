const express = require('express');
const router = express.Router();

//User route controller
const UserController = require('../controllers/user.controller');

router.use((req, res, next) => {
    console.log(`New authentication process with data:`, req.body);
    next(); 
});
router.post('/login', UserController.login);
router.post('/sign_up', UserController.sign_up);

module.exports = router;