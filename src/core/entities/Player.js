// Tools
const { performQuery } = require('../../infrastructure/MongoManager')
// Errors
const { QueryError } = require('../../errors/queryErrors')
const { ResourceNotExists, DuplicatedResource } = require('../../errors/resourceErrors')

/**
 * Player Model
 */
class Player {
  /**
   * @param {String} playerID
   * @param {String} name
   * @param {String} nickname
   * @param {String} email
   */
  constructor (playerID, email, name = '', nickname = '') {
    this.playerID = playerID
    this.name = name
    this.nickname = nickname
    this.email = email
  }

  /**
   * createPlayer - stores a Player instance inside the "player" collection.
   * REQUIREMENT - the player ID and email should be seted before runing
   * this method.
   * @param {String} name
   * @param {String} nickname
   * @returns {Promise<Responser>}
   */
  async createPlayer (name = '', nickname = '') {
    const player = new Player(
      this.playerID,
      this.email,
      name || this.name,
      nickname || this.nickname
    )
    return await performQuery(
      'player',
      async collection => {
        const insert = await collection.insertOne(player)
        if (!insert.result.ok) throw new QueryError('We cannot create the player', 'player', insert)
      }
    )
  }

  /**
   * getplayer - search a player in the "player" collection and returns it
   * if exists.
   * @param {string} playerID - the ID of the player to be searched.
   * @returns {Promise<Player>} - (if exists) returns the player
   */
  static async getPlayer (playerID) {
    const { data } = await performQuery(
      'player',
      async collection => {
        const query = await collection.findOne({ playerID })
        if (!query) throw new ResourceNotExists('player', playerID)
        return query
      }
    )
    return data
  }

  /**
   * updatePlayer - updates the main data of a player.
   * @param {string} playerID - the id of the player to be updated.
   * @param {object} param1
   * @param {string} param1.name
   * @param {string} param1.nickname
   */
  static async updatePlayer (playerID, { name, nickname }) {
    return !!(await performQuery(
      'player',
      async collection => {
        const update = await collection.updateOne(
          { playerID },
          { $set: { name, nickname } }
        )
        if (!update.result.ok) throw new QueryError('cannot update the user correctly', 'player', result)
      }
    ))
  }

  static async updateEmail (playerID, email) {
    const { data: exists } = await performQuery(
      'player',
      async collection => await collection.findOne({ email })
    )
    if (exists) throw new DuplicatedResource('email', 'there are a player with this email')
    return !!(await performQuery(
      'player',
      async collection => {
        const update = await collection.updateOne(
          { playerID },
          { $set: { email } }
        )
        if (!update.result.ok) throw new QueryError('cannot update the email', 'player', result)
        return true
      }
    ))
    // fix: the email should be updated in both the "player" and the "auth" collections.
  }
}

module.exports = Player
