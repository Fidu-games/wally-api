const Player = require('../core/entities/Player')
const Responser = require('../tools/Responser')
const { requestValidator } = require('../tools/validate')

/**
 * METHOD: GET
 * DATA: params: { playerID? }, req: { playerID }
 * URI: /player/:playerID?
 */
exports.getPlayer = function (req, res) {
  const result = new Responser()
  const playerID = req.params?.playerID ? req.params.playerID : req.playerID

  Player.getPlayer(playerID)
    .then(data => {
      result.setSuccess({ data: data })
      res.json(result)
    })
    .catch(error => {
      result.errors = error
      res.status(404).json(result)
    })
}

/**
 * METHOD: PATCH
 * DATA: body: { name, nickname }, req: { playerID }
 * URI: /player
 */
exports.updatePlayer = [
  (req, res, next) => requestValidator(res, next, req.body, 'name', 'nickname'),
  function (req, res) {
    const result = new Responser()
    const playerID = req.playerID
    const { name, nickname } = req.body

    Player.updatePlayer(playerID, { name, nickname })
      .then(updateResult => {
        result.setSuccess({ data: updateResult })
        res.json(result)
      })
      .catch(error => {
        result.errors = error
        res.status(500).json(result)
      })
  }
]
