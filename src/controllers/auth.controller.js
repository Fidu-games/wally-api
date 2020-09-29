const Auth = require('../core/Auth')
const { requestValidator } = require('../tools/validate')

exports.signIn = [
  (req, res, next) => requestValidator(res, next, req.body, 'email', 'password'),
  function (req, res) {
    const { email, password } = req.body
    Auth.signIn(email, password)
      .then(token => {
        res.json({
          success: true,
          data: { token }
        })
      })
      .catch(error => {
        res.status(401).json({
          success: false,
          errors: error.toString()
        })
      })
  }
]

exports.signUp = [
  (req, res, next) => requestValidator(
    res,
    next,
    req.body,
    'name', 'nickname', 'email', 'password'
  ),
  function (req, res) {
    const { email, password, name, nickname } = req.body
    Auth.createAuth(email, password)
      .then(user => {
        return user.createUser(name, nickname)
      })
      .then(result => res.json(result))
      .catch(error => {
        res.status(500).json({
          success: false,
          errors: error.toString()
        })
      })
  }
]
