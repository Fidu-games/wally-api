const Auth = require('../core/Auth')
const { requestValidator } = require('../tools/validate')
const Responer = require('../tools/Responser')

/**
 * METHOD: POST.
 * DATA: body: { email, password }
 * URI: /auth/login
 */
exports.logIn = [
  // Validate that an email and password is in the body of the request.
  (req, res, next) => requestValidator(res, next, req.body, 'email', 'password'),
  function (req, res) {
    const result = new Responer()
    const { email, password } = req.body

    // Asynchronous login to let other process execute at the same form.
    Auth.logIn(email, password)
      .then(({ token, refreshToken }) => {
        result.setSuccess({ data: { token, refreshToken } })
        res.json(result)
      })
      .catch(error => {
        result.errors = error.message
        res.status(401).json(result)
      })
  }
]

/**
 * METHOD: POST
 * DATA: body: { name, nickname, email, password }
 * URI: /auth/signup
 */
exports.signUp = [
  (req, res, next) => requestValidator(
    res,
    next,
    req.body,
    'name', 'nickname', 'email', 'password'
  ),
  function (req, res) {
    const result = new Responer()
    const { email, password, name, nickname } = req.body
    let token
    let refreshToken

    // creating an auth object in the DB. (it also creates the player ID)
    Auth.createAuth(email, password)
      // creating the player objetct in the DB
      .then(({ player, token: t, refreshToken: rt }) => {
        token = t
        refreshToken = rt
        return player.createPlayer(name, nickname)
      })
      .then(() => {
        result.setSuccess({
          messages: 'user created with success',
          data: { token, refreshToken }
        })
        res.json(result)
      })
      .catch(error => {
        result.errors = error.toString()
        res.status(500).json(result)
      })
  }
]

/**
 * METHOD: GET
 * DATA: req: { userID }
 * URI: /auth/token/:refreshToken
 */
exports.refreshToken = [
  (req, res, next) => requestValidator(res, next, req.params, 'refreshToken'),
  function (req, res) {
    const result = new Responer()
    const { refreshToken } = req.params

    Auth.refreshToken(refreshToken)
      .then(token => res.json({ success: true, data: { token } }))
      .catch(error => {
        result.errors = error.message
        res.status(500).json(result)
      })
  }
]
