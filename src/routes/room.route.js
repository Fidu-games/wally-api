const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/room.controller');
const Room = require('../core/Room');

router.post('/create', RoomController.createRoom);
router.delete('/delete', RoomController.deleteRoom);

module.exports = router;