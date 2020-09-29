const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room.controller');

//room/...
router.post('/create', RoomController.createRoom);
router.delete('/delete', RoomController.deleteRoom);
router.get('/exists/:roomID', RoomController.roomExists);

module.exports = router;