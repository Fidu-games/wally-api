const JWT = require('jsonwebtoken')
const config = require('../../config')
const crypt = require('../tools/crypt')
const {genRandomKey} = require('../tools/generators')
const {performQuery} = require('../infrastructure/MongoManager')
const User = require('../core/entities/User')
const {QueryError, ResourceError} = require('../errors/queryErrors')
const {DuplicatedResource} = require('../errors/resourceErrors')


class Auth {

    constructor(email, password) {
        this.userID = genRandomKey(18);
        this.email = email;
        this.password = password;
    }

    static createToken(ID) {
        return JWT.sign({userID: ID}, config.authJWTSecret);
    }

    /**
     *
     * @param email
     * @param password
     * @returns {Promise<String>}
     */
    static async signIn(email, password) {
        let user = await performQuery(
            'auth',
            async userCollection => (
                userCollection.findOne({email: email})
            )
        )

        if(!user.success) {
            throw new ResourceError('The user doesnt exists', `user:${user.email}`, 'user');
        }

        let passwordsCoincide = await crypt.comparePasswords(password, user.data.password);
        if(!passwordsCoincide) throw new TypeError('The password is wrong');
        return Auth.createToken(user.data.userID); //token
    }

    static async userExists(email) {
        return !!(await performQuery(
            'auth',
            async collection => (
                await collection.findOne({email})
            )
        ))
    }

    /**
     *
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
    static async createAuth(email, password) {
        let userExists = await Auth.userExists(email);
        if(userExists) {
            throw new DuplicatedResource('user', 'this email is already registered');
        }

        let auth = new Auth(email, password);
        let result = await performQuery(
            'auth',
            async collection => {
                let insert = await collection.insertOne(auth);
                if(!insert.result.ok) throw new QueryError('error while creating the auth object', 'auth');
                return insert;
            }
        )

        if(!result.success) throw new Error('Could not create the auth obj, errors: ' + result.errors.toString());

        return new User(auth.userID, auth.email);
    }
}

module.exports = Auth;