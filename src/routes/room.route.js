const router = require('express').Router()
const RoomController = require('../controllers/room.controller')
const { tokenValidator } = require('../tools/validate')

router.use(tokenValidator)

router.get('/:roomID', RoomController.getRoom)
router.post('/create', RoomController.createRoom)
router.delete('/:roomID', RoomController.deleteRoom)
router.get('/:roomID/exists', RoomController.roomExists)

module.exports = router
