const Model = require('./Model'),
      MongoManager = require('../infrastructure/MongoManager'),
      RedisManager = require('../infrastructure/RedisManager'),
      crypt = require('../tools/crypt');

class User extends Model{
    constructor({name = "", nickname = "", email  = "", password = ""} = {}){
        super();
        this.name = name;
        this.nickname = nickname;
        this.email = email;
        this.password = password;

        this.setOutput();
    }

    get asJSON(){
        return {
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            password: this.password
        }
    }

    async hashPassword(password){
        //encrypt the password ?
        let passResult = await crypt.hash(password || this.password);
        if(!passResult) return false;
        this.password = passResult;
        return true;
    }

    async login(){
        let exists, realPassword, passwordCompare, token;

        this.setOutput();

        try{
            exists = await MongoManager.emailExists(this.email);
            if(!exists) throw "Incorrect user";

            realPassword = exists.password;
            passwordCompare = await crypt.comparePasswords(this.password, realPassword);
            if(!passwordCompare) throw "Incorrect Password";

            this.password = '';
            token = RedisManager.createSession(this.email);

            this.output.setSuccess({
                messages: 'You habe been loged in successfully',
                data: {'token': token}
            });
        }catch(e){
            console.log(e);
            this.setError(e);
        }finally{
            return this.getOutput();
        }
    }

    async sign_up(){
        let client;

        this.setOutput();

        try{
            const exists = await MongoManager.emailExists(this.email);
            if(exists) throw 'This email is already registered';

            client = await MongoManager.getClient();
            const db = client.db(this.mongo.db);
            const collection = db.collection('user');
            const insert = await collection.insertOne(
                Object.assign(this.asJSON, {date: new Date()})
            );
            if(!insert.result.ok) throw 'There was an error while registering you';

            this.password = '';
            delete insert.ops[0].password;

            const token = RedisManager.createSession(this.email);

            this.output.setSuccess({
                messages: 'You have been registered succesfully',
                data: {token: token}
            });
        }catch(e){
            this.setError(e);
        }finally{
            client.close();
            return this.getOutput();
        }
    }
}

exports.User = User;

exports.login = async (email, password) => {
    let user = new User({email: email, password: password});
    return await user.login(); 
}

exports.sign_up = async (name, nickname, email, password) => {
    let user = new User({
        name: name,
        nickname: nickname,
        email: email
    });

    let passwordHashingResult = await user.hashPassword(password);

    if(!passwordHashingResult){
        user.setError("The password couldn't be hashed.");
        return user.getOutput();
    }

    return await user.sign_up();
}