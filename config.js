const hostname = '127.0.0.1',
      port = 8080,
      protocol = 'http';

module.exports = {
    host: {
        hostname: hostname,
        port: port,
        protocol: protocol,
        url: `${protocol}://${hostname}:${port}`
    },
    database:{
        mongo:{

        },
        redis:{
            
        }
    }
};