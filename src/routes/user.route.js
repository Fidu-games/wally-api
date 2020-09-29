const express = require('express');
const router = express.Router();

//User route controller
const UserController = require('../controllers/user.controller');

// router.use((req, res, next) => {
//     console.log(`New user process with data:`, req.body);
//     next(); 
// });

//user/...
router.get('/:token', UserController.getUser);
router.delete('/session', UserController.closeSession);
router.post('/login', UserController.login);
router.post('/sign_up', UserController.sign_up);

module.exports = router;