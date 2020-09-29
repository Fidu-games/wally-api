const router = require('express').Router()

// User route controller
const UserController = require('../controllers/user.controller')

// /user/...
router.get('/', UserController.getUser)
router.delete('/session', UserController.closeSession)
router.post('/login', UserController.login)
router.post('/sign_up', UserController.sign_up)

module.exports = router
