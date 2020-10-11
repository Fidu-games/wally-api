const router = require('express').Router()
const AuthController = require('../controllers/auth.controller')

router.post('/login', AuthController.logIn)
router.post('/signup', AuthController.signUp)
router.get('/token/:refreshToken', AuthController.refreshToken)

module.exports = router
