const router = require('express').Router(),
      AuthController = require('../controllers/auth.controller');

router.post('/signin', AuthController.signIn);

module.exports = router;