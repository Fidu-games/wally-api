const user = require('../core/User')
const RedisManager = require('../infrastructure/RedisManager')

exports.getUser = [
  RedisManager.validateSessionWithContinue,
  async (req, res) => {
    const token = req.params.token
    const userData = await user.User.getData(token)
    res.json(userData)
  }
]
