const config = require('../../config')
const MongoClient = require('mongodb').MongoClient
const Responser = require('../tools/Responser')

class MongoManager {
  static async getClient () {
    const client = await MongoClient.connect(config.database.mongo.url, config.database.mongo.options)
    return MongoManager.evalClient(client)
  }

  static evalClient (client) {
    if (!client) {
      throw 'No se logro conectar con la base de datos'
    }
    return client
  }

  static async getCollection (collectionName) {
    const client = await MongoManager.getClient()
    const db = client.db(config.database.mongo.db)
    if (!db) throw new Error('this database doesnt exists')
    const collection = db.collection(collectionName)
    if (!collection) throw new Error('this collection doesnt exists')
    return [collection, client]
  }
}

module.exports = MongoManager

exports.performQuery = async (collectionName, querier) => {
  const result = new Responser()
  let collection
  let client

  try {
    [collection, client] = await MongoManager.getCollection(collectionName)
    const queryResult = await querier(collection)
    result.setSuccess({ data: queryResult })
  } catch (error) {
    console.log(error)
    result.errors = error.message
  } finally {
    client.close()
  }

  return result
}
