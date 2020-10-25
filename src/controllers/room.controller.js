const Room = require('../core/entities/Room')
const Responser = require('../tools/Responser')
const { requestValidator } = require('../tools/validate')

exports.getRoom = [
  (req, res, next) => requestValidator(res, next, req.params, 'roomID'),
  function (req, res) {
    const { roomID } = req.params
    Room.getRoom(roomID)
      .then(roomData => {
        res.json({ success: true, data: roomData })
      })
      .catch(error => {
        res.status(500).send({ success: false, errors: error })
      })
  }
]

exports.createRoom = function (req, res) {
  const result = new Responser()
  const { playerID } = req
  Room.createRoom(playerID)
    .then(room => {
      result.setSuccess({ data: room })
      res.json(result)
    })
    .catch(error => {
      result.errors = error
      res.status(500).json(result)
    })
}

exports.deleteRoom = [
  (req, res, next) => requestValidator(res, next, req.params, 'roomID'),
  function (req, res) {
    const { playerID } = req
    const { roomID } = req.params
    Room.deleteRoom(playerID, roomID)
      .then(deletResult => {
        res.json(deletResult)
      })
      .catch(error => {
        res.status(500).send({ success: false, errors: error })
      })
  }
]

exports.roomExists = [
  (req, res, next) => requestValidator(res, next, req.params, 'roomID'),
  function (req, res) {
    const result = new Responser()
    const { roomID } = req.params
    Room.exists(roomID)
      .then(exists => {
        result.setSuccess({ data: { exists } })
        res.json(result)
      })
      .catch(error => {
        result.errors = error
        res.status(500).send(result)
      })
  }
]
