const Room = require('../core/Room')
const validate = require('../tools/validate')
const uuid = require('uuid-random')

exports.createRoom = [
  (req, res, next) => {
    const result = validate.evalRecivedData(req.body, 'limit')
    if (!result.ok) {
      res.status(422)
      res.json({
        messages: `Invalid data: ${result.evaluated}`
      })
    }
    next()
  },
  async (req, res) => {
    const id = req.body.id || uuid()
    const limit = req.body.limit
    const creationResult = await Room.createRoom(id, limit)
    res.send(creationResult)
  }
]

exports.deleteRoom = [
  (req, res, next) => {
    const result = validate.evalRecivedData(req.body, 'id')
    if (!result.ok) {
      res.status(422)
      res.json({
        messages: `Invalid data: ${result.evaluated}`
      })
    }
    next()
  },
  async (req, res) => {
    const { id } = req.body
    res.send(await Room.deleteRoom(id))
  }
]

exports.roomExists = [
  (req, res, next) => {
    const result = validate.evalRecivedData(req.params, 'roomID')
    if (!result.ok) {
      res.status(422).json({
        messages: `Invalid data: ${result.evaluated}`
      })
    }
    next()
  },
  async (req, res) => {
    const { roomID } = req.params
    const roomConsultResult = await Room.roomExists(roomID)
    res.json(roomConsultResult)
  }
]
