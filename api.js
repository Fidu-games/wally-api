//Dependencies
const express = require('express'),
      path = require('path'),
      morgan = require('morgan'),
      cors = require('cors');

//route files
const index_router = require('./src/routes/index.route'),
      auth_router = require('./src/routes/auth.route'),
      user_router = require('./src/routes/user.route'),
      room_router = require('./src/routes/room.route'),
      utilities_router = require('./src/routes/utilities.route');

//main objects
const api = express();

//API configuration
api.use(morgan('dev', {}));
api.use(cors());
api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.use(express.static(path.join(__dirname, 'public')));

//API routes
api.use('/', index_router);
api.use('/auth', auth_router);
api.use('/user', user_router);
api.use('/room', room_router);
api.use('/utilities', utilities_router);

module.exports = api;