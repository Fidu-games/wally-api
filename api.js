// Dependencies
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')

// route files
// const indexRouter = require('./src/routes/index.route')
const authRouter = require('./src/routes/auth.route')
const playerRouter = require('./src/routes/player.route')
// const roomRouter = require('./src/routes/room.route')

// main objects
const api = express()

// API configuration
api.use(morgan('dev', {}))
api.use(cors())
api.use(express.json())
api.use(express.urlencoded({ extended: false }))
api.use(express.static(path.join(__dirname, 'public')))

// API routes
// api.use('/', indexRouter)
api.use('/auth', authRouter)
api.use('/player', playerRouter)
// api.use('/room', roomRouter)

module.exports = api
