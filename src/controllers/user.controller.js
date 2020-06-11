const validate = require('../tools/validate'),
      user = require('../Core/User'),
      RedisManager = require('../infrastructure/RedisManager');

exports.login = [
    RedisManager.validateSession,
    (req, res, next) => {
        let result = validate.evalRecivedData(req.body, "email", "password");
        if(!result.ok){
            res.status(422),
            res.send(`Faltan los siguientes datos para realizar el registro: ${result.evaluated}`);
            return;
        }
        next();
    },
    async (req, res) => {
        let { email, password } = req.body;
        let loginResult = await user.login(email, password);
        res.json(loginResult);
    }
];

exports.sign_up = [
    (req, res, next) => {
        let result = validate.evalRecivedData(req.body, "name", "nickname", "email", "password");
        if(!result.ok){
            res.status(422);
            res.send(`Faltan los siguientes datos para realizar el registro: ${result.evaluated}`); 
            return;
        }
        next();
    },
    async (req, res) => {
        let {name, nickname, email, password} = req.body;
        let signUpResult = await user.sign_up(name, nickname, email, password);
        res.json(signUpResult);
    }
];