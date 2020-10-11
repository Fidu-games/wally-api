require('dotenv').config()

const hostConfig = {
  hostname: '192.168.0.102',
  port: 8080,
  protocol: 'http'
}

const mongoConfig = {
  port: 27017,
  hostname: 'localhost'
}

module.exports = {
  authJWTSecret: process.env.ACCESS_KEY,
  host: {
    hostname: hostConfig.hostname,
    port: hostConfig.port,
    protocol: hostConfig.protocol,
    url: `${hostConfig.protocol}://${hostConfig.hostname}:${hostConfig.port}`
  },
  peerServer: {
    hostname: '192.168.0.102',
    protocol: 'http',
    port: 8081,
    url: 'http://192.168.0.102:8081'
  },
  database: {
    mongo: {
      db: 'wally',
      url: `mongodb://${mongoConfig.hostname}:${mongoConfig.port}`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    }
  },
  app: {
    token: {
      auth: {
        expireTime: 900
      },
      refresh: {
        expireTime: '7d'
      }
    }
  }
}
