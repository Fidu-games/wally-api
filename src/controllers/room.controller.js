const Room = require('../core/Room'),
      validate = require('../tools/validate'),
      uuid = require('uuid-random');

exports.createRoom = [
    (req, res, next) => {
        let result = validate.evalRecivedData(req.body, "limit");
        if(!result.ok) {
            res.status(422)
            res.json({
                messages: `Invalid data: ${result.evaluated}`
            });
        }
        next();
    },
    async (req, res) => {
        let id = req.body.id || uuid();
        let limit = req.body.limit;
        let creationResult = await Room.createRoom(id, limit);
        res.send(creationResult);
    }
];

exports.deleteRoom = [
    (req, res, next) => {
        let result = validate.evalRecivedData(req.body, "id");
        if(!result.ok) {
            res.status(422)
            res.json({
                messages: `Invalid data: ${result.evaluated}`
            });
        }
        next();
    },
    async (req, res) => {
        let { id } = req.body;
        let deleteRoom = await Room.deleteRoom(id);
        res.send(deleteRoom);
    }
];