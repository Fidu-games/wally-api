const router = require('express').Router()

// index route controller
const IndexController = require('../controllers/index.controller')

router.get('/', IndexController.showGreeting)

module.exports = router
