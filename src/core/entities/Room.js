const { genRandomKey } = require('../../tools/generators')
const uuid = require('uuid-random')
const { performQuery } = require('../../infrastructure/MongoManager')
const { QueryError } = require('../../errors/queryErrors')

class Room {
  constructor (playerID) {
    this.roomID = uuid()
    this.shortRoomID = genRandomKey(6)
    this.date = Date.now()
    this.gameMaster = playerID
  }

  static async getRoom (roomID) {
    const { data } = await performQuery(
      'room',
      async colleciton => (
        await colleciton.findOne({ roomID })
      )
    )
    return data
  }

  static async createRoom (playerID) {
    const room = new Room(playerID)
    const result = await performQuery(
      'room',
      async collection => {
        const insert = await collection.insertOne(room)
        if (!insert.result.ok) throw new QueryError('can not create the room', 'room', insert)
      }
    )
    if (!result.success) throw result.errors
    return room
  }

  static async deleteRoom (playerID, roomID) {
    return await performQuery(
      'room',
      async collection => {
        const deletion = await collection.deleteOne({ roomID, gameMaster: playerID })
        if (deletion.result.ok) throw new QueryError(`can not delete the room ${roomID}. just the gamemaster can delete the room`, 'room')
      }
    )
  }

  static async exists (roomID) {
    const result = await performQuery(
      'room',
      async collection => (
        await collection.findOne({ roomID })
      )
    )
    return !!(result.data)
  }
}

module.exports = Room
