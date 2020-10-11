// Configuration
const config = require('../../config')
// Frameworks
const JWT = require('jsonwebtoken')
// Entities
const Player = require('./entities/Player')
// Tools
const crypt = require('../tools/crypt')
const { genRandomKey } = require('../tools/generators')
const { performQuery } = require('../infrastructure/MongoManager')
// Errors
const { QueryError, ResourceError } = require('../errors/queryErrors')
const { DuplicatedResource } = require('../errors/resourceErrors')

/**
 * Auth Model: controls the authentication process in the wally ecosystem.
 * The class consist of a set of static functions that manage main process
 * related to an authentication. Every time that you want to perform some
 * action in the Mongo database, you need to call the "performQuery"
 * function.
 * To code use Standard.js style.
 */
class Auth {
  /**
   * @property {string} playerID - auto-generated player ID of 18 alfanumeric characters.
   * @param {string} email - the email of the player.
   * @param {string} password - the no-hashed password of the player.
   */
  constructor (email, password) {
    this.playerID = genRandomKey(18)
    this.email = email
    this.password = password
  }

  /**
   * getInstance - generates an instance of Auth but with the hashed password.
   * @param {string} email - the email of the player.
   * @param {string} password - the no-hashed password of the player.
   * @returns {Promise<Auth>} - the auth object with the hashed password.
   */
  static async getInstance (email, password) {
    password = await crypt.hash(password)
    return new Auth(email, password)
  }

  /**
   * createToken - generates a JWT token with the player ID and type inside of its payload.
   * @param {string} playerID - the player id that will be inside the generated token.
   * @param {string} type - the type of the token. Can be both "auth" or "refresh".
   * Note: the auth token will have an expiration time of 15 minutes, the refresh one,
   * seven days.
   * @returns {Promise<string>} the token.
   */
  static async createToken (playerID, type) {
    const { expireTime } = config.app.token[type]
    return await new Promise((resolve, reject) => {
      JWT.sign(
        {
          playerID: playerID,
          type: type
        },
        config.authJWTSecret,
        { expiresIn: expireTime },
        (err, encoded) => {
          if (err) reject(err)
          resolve(encoded)
        }
      )
    })
  }

  /**
   * refreshToke - to have security in every "auth" token we dispatch, we set a short
   * expiration time for that kind of tokens. And we give the user a refresh token with a
   * longer expiration time to regenerate an "auth" token every time that expires.
   * Then, this function generates an "auth" token validating the "refresh" one.
   * @param {string} refreshToken - the valid token of type "refresh".
   * @returns {Promise<string>} - a new token of type "auth".
   */
  static async refreshToken (refreshToken) {
    const data = JWT.verify(refreshToken, config.authJWTSecret)
    if (data.type !== 'refresh') throw TypeError('refeshToken invlaid')
    const token = await Auth.createToken(data.playerID, 'auth')
    return token
  }

  /**
   * playerExists - verify if a user exists by his email in the "auth" collection.
   * @param {string} email - the email of the player that want to be comprobated.
   * @returns {Promise<Responser>} an object describing the process result.
   */
  static async playerExists (email) {
    return await performQuery(
      'auth',
      async collection => {
        const result = await collection.findOne({ email: email })
        if (!result) throw new ResourceError('The player doesnt exists', `email:${email}`, 'player')
        return result
      }
    )
  }

  /**
   * logIn - logs in a player with his email and password with the JWT method.
   * @param {string} email - the email of the player.
   * @param {string} password - the no-hashed password of the player.
   * @returns {Promise<{token: string, refreshToken: string}>} an object with the user tokens.
   */
  static async logIn (email, password) {
    // There are some player with this email?
    const player = await Auth.playerExists(email)
    if (!player.success) {
      throw new ResourceError('Incorrect email', `player:${email}`, 'player')
    }
    // The incoming password its correct?
    const passwordsCoincide = await crypt.comparePasswords(password, player.data.password)
    if (!passwordsCoincide) throw new TypeError('The password is wrong')
    // Ok, we provide you an "auth" token and a "refresh" token to interact with our API.
    const token = await Auth.createToken(player.data.playerID, 'auth')
    const refreshToken = await Auth.createToken(player.data.playerID, 'refresh')
    return { token, refreshToken }
  }

  /**
   * createAuth - creates an instance of the Auth class in the "auth" collection.
   * @param {string} email - the email of the player.
   * @param {string} password - the no-hashed password of the player.
   * @returns {Promise<Player>} - an instance of the Player class that contains the playerID
   * and the email to store it in the database in the future.
   */
  static async createAuth (email, password) {
    // There are some player with this email?
    const { success: playerExists } = await Auth.playerExists(email)
    if (playerExists) {
      throw new DuplicatedResource('player', 'this email is already registered')
    }
    // Creting the auth instance.
    const auth = await Auth.getInstance(email, password)
    const result = await performQuery(
      'auth',
      async collection => {
        const insert = await collection.insertOne(auth)
        if (!insert.result.ok) throw new QueryError('error while creating the auth object', 'auth')
        return insert
      }
    )
    if (!result.success) throw new Error('Could not create the auth obj, errors: ' + result.errors.toString())
    // returning the Player instance, an "auth" token and a "refresh" token.
    return {
      player: new Player(auth.playerID, auth.email),
      token: await Auth.createToken(auth.playerID, 'auth'),
      refreshToken: await Auth.createToken(auth.playerID, 'refresh')
    }
  }
}

module.exports = Auth
