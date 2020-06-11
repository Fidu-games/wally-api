const config = require('../../config'),
      redis = require('redis'),
      token_generator = require('uuid-random');

const client = redis.createClient(config.database.redis.port);
exports.client = client;

const minut = 60; 

class RedisManager{

    static createSession(email){
        let token = token_generator();
        client.setex(token, 60 * minut, email);
        return token;
    }

    static deleteSession(token){
        client.del(token);
    }

    static validateSession(req, res, next){
        let {token} = req.body;
        if(token){
            client.get(token, (err, id) => {
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                }
    
                if(id == null){
                    next(); //if the token doesn't exists, passes.
                }else{
                    // res.redirect(`${config.peerServer.url}/user/${token}`);
                    res.json({
                        success: true,
                        messages: 'You habe been loged in successfully',
                        data: {token: token},
                        errors: '',
                    });
                }
            });
        }else{
            next();
        }
    }
}

module.exports = RedisManager;