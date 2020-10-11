const JWT = require('jsonwebtoken')
const config = require('../../config')

exports.evalRecivedData = (recived, ...expected) => {
  let evaluated = []
  let ok = false

  if (recived != null && Object.keys(recived).length > 0) {
    evaluated = expected.map(current => {
      return !Object.keys(recived).some(key => {
        return key === current && recived[key] != null && recived[key] !== ''
      }) ? current : null
    })
    ok = evaluated.every(v => v == null)
  }

  return {
    evaluated: evaluated.filter(m => m != null),
    ok: ok
  }
}

exports.requestValidator = (res, next, recived, ...expected) => {
  const result = exports.evalRecivedData(recived, ...expected)
  if (!result.ok) {
    res.status(422).send(result.evaluated)
    return
  }
  next()
}

exports.tokenValidator = (req, res, next) => {
  const tokenHeader = req.headers.authorization

  if (tokenHeader) {
    const token = tokenHeader.split(' ')[1]

    if (token) {
      JWT.verify(token, config.authJWTSecret, (error, data) => {
        if (!error) {
          req.playerID = data.playerID
          next()
        } else {
          res.sendStatus(403)
        }
      })
    } else {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
}
