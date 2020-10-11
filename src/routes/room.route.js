const router = require('express').Router()
const RoomController = require('../controllers/room.controller')
const { tokenValidator } = require('../tools/validate')

router.use(tokenValidator)

router.post('/create', RoomController.createRoom)
router.delete('/delete', RoomController.deleteRoom)
router.get('/exists/:roomID', RoomController.roomExists)

module.exports = router
