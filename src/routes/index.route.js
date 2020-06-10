const express = require('express');
const router = express.Router();

//index route controller
const IndexController = require('../controllers/index.controller');

router.get('/', IndexController.showGreeting);

module.exports = router;