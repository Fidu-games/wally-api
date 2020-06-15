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

    static async deleteSession(token){
        return new Promise((resolve, reject) => {
            client.del(token, (err, data) => {
                if(err) reject(err);
                resolve(data);
            });
        });
    }

    static validateSessionWithContinue(req, res, next){
        let token = req.params.token;
        if(token){
            client.get(token, (err, id) => {
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                }
    
                if(id == null){
                    res.json({
                        success: false,
                        messages: 'Deneid access, the user dont have a token.',
                    });
                }else{
                    next();
                }
            });
        }else{
            res.json({
                success: false,
                messages: 'Deneid access, the user dont have a token.',
            });
        }
    }

    static validateSessionWithOutContinue(req, res, next){
        let token = req.body.token;
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

    static async getEmail(token){
        return await new Promise((resolve, reject) => {
            client.get(token, (err, data) => {
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    }

    static async setRoomShortCode(code, roomID){
        return new Promise((resolve, reject) => {
            client.set(code, roomID, (err, rep) => {
                if(err) reject(err);
                resolve(rep);
            });
        });
    }

    static async getRoomID(code){
        return new Promise((resolve, reject) => {
            client.get(code, (err, rep) => {
                if(err) reject(err);
                resolve(rep);
            });
        });
    }

    static async deleteShortCode(code){
        return new Promise((resolve, reject) => {
            client.del(code, (err, rep) => {
                if(err) reject(err);
                resolve(rep);
            });
        });
    }
}

module.exports = RedisManager;