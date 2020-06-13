const host_config = {
      hostname: '192.168.1.76',
      port: 8080,
      protocol: 'http'
};

const mongo_config = {
    port: 27017,
    hostname: host_config.hostname
};

module.exports = {
    host: {
        hostname: host_config.hostname,
        port: host_config.port,
        protocol: host_config.protocol,
        url: `${host_config.protocol}://${host_config.hostname}:${host_config.port}`
    },
    peerServer:{
        hostname: '127.0.0.1',
        protocol: 'http',
        port: 8081,
        url: 'http://127.0.0.1:8081'
    },
    database:{
        mongo:{
            db: 'wally',
            url: `mongodb://${mongo_config.hostname}:${mongo_config.port}`,
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        redis:{
            port: 6379
        }
    }
};