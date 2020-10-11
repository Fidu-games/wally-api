const uuid = require('uuid-random')
const MongoManager = require('../infrastructure/MongoManager')
// const RedisManager = require('../infrastructure/RedisManager')
const Responser = require('../tools/Responser')
const { QueryError } = require('../errors/queryErrors')

class Room {
  constructor (roomID = '', playersLimit = 6) {
    this.roomID = roomID || uuid()
    this.playersLimit = playersLimit
  }

  asJSON () {
    return {
      roomID: this.roomID,
      limit: this.playersLimit
    }
  }

  static getTempShortCode (digits = 6) {
    let code = ''
    let number
    for (let i = 0; i < digits; i++) {
      number = Math.floor(Math.random() * 9)
      code += number
    }
    return code
  }

  static async createRoom (id, limit) {
    const res = new Responser()
    let collection
    let client

    try {
      [collection, client] = await MongoManager.getCollection('room')
      const insert = await collection.insertOne({
        roomID: id,
        limit: limit
      })
      if (!insert.result.ok) throw new QueryError('The room couldn\'t be registered', 'room')

      const short = Room.getTempShortCode()
      // const codeRegistResult = await RedisManager.setRoomShortCode(short, id)
      // if (!codeRegistResult) throw new QueryError("The room couldn't be registered", 'room')

      res.setSuccess({
        messages: 'The room has been registered',
        data: {
          shortRoomID: short,
          roomID: id
        }
      })
    } catch (e) {
      console.log(e)
      res.errors = e
    } finally {
      client.close()
    }

    return res
  }

  static async deleteRoom (id) {
    const res = new Responser()
    let collection
    let client

    try {
      [collection, client] = await MongoManager.getCollection('room')
      const remove = await collection.deleteOne({ roomID: id })
      if (!remove) throw new QueryError('The room could not be deleted', 'room')

      res.setSuccess({
        messages: 'Se ha eliminado el cuarto correctamente'
      })
    } catch (e) {
      console.log(e)
      res.errors = e
    } finally {
      client.close()
    }

    return res
  }

  static async roomExists (id) {
    const res = new Responser()
    // try {
    //   console.log(`Room ID: ${id}`)
    //   const trueIDCache = await RedisManager.getRoomID(id)
    //   if (!trueIDCache) throw new Error('You do not have acces to this room or it doesn\'t exists')
    //   res.setSuccess({
    //     messages: 'the room exists',
    //     data: { roomID: trueIDCache }
    //   })
    // } catch (e) {
    //   console.log(e)
    //   res.errors = e
    // }

    return res
  }
}

module.exports = Room
