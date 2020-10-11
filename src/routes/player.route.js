const router = require('express').Router()
const PlayerController = require('../controllers/player.controller')
const { tokenValidator } = require('../tools/validate')

// /player/...
router.use(tokenValidator)

router.get('/:playerID?', PlayerController.getPlayer)
router.patch('/', PlayerController.updatePlayer)

module.exports = router
