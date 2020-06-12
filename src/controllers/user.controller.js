const validate = require('../tools/validate'),
      user = require('../core/User'),
      RedisManager = require('../infrastructure/RedisManager');

exports.getUser = [
    RedisManager.validateSessionWithContinue,
    async (req, res) => {
        let token = req.params.token;
        let userData = await user.User.getData(token);
        res.json(userData);
    }
];

exports.closeSession = async (req, res) => {
    let token = req.body.token;
    let closeResult = await RedisManager.deleteSession(token);
    res.json({
        success: closeResult
    });
};

exports.login = [
    RedisManager.validateSessionWithOutContinue,
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