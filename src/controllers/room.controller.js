const Room = require('../core/Room')
const uuid = require('uuid-random')
const { requestValidator } = require('../tools/validate')

exports.createRoom = [
  (req, res, next) => requestValidator(res, next, req.body, 'limit'),
  async (req, res) => {
    const id = req.body.id || uuid()
    const limit = req.body.limit
    const creationResult = await Room.createRoom(id, limit)
    res.send(creationResult)
  }
]

exports.deleteRoom = [
  (req, res, next) => requestValidator(res, next, req.body, 'id'),
  async (req, res) => {
    const { id } = req.body
    res.send(await Room.deleteRoom(id))
  }
]

exports.roomExists = [
  (req, res, next) => requestValidator(res, next, req.params, 'roomID'),
  async (req, res) => {
    const { roomID } = req.params
    const roomConsultResult = await Room.roomExists(roomID)
    res.json(roomConsultResult)
  }
]
