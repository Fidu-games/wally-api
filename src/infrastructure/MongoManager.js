const config = require('../../config'),
      mongodb_client = require('mongodb').MongoClient,
      Responser = require('../tools/Responser'),
      QueryError = require('../errors/queryErrors/QueryError');

module.exports = class MongoManager {

    static async getClient() {
        let client = await mongodb_client.connect(config.database.mongo.url, config.database.mongo.options);
        return MongoManager.evalClient(client);
    }

    static evalClient(client) {
        if(!client){
            throw "No se logro conectar con la base de datos";
        }
        return client;
    }

    static async getCollection(collectionName) {
        let client = await MongoManager.getClient();
        let db = client.db(config.database.mongo.db);
        if(!db) throw new Error('this database doesnt exists');
        let collection = db.collection(collectionName);
        if(!collection) throw new Error('this collection doesnt exists');
        return [collection, client];
    }
}

exports.performQuery = async (collectionName, querier) => {
    let result = new Responser();
    let collection, client;

    try {
        [collection, client] = await MongoManager.getCollection(collectionName);
        let queryResult = await querier(collection);
        result.setSuccess({ data: queryResult });
    } catch (error) {
        console.log(error);
        result.errors = error.message;
    } finally {
        client.close();
    }

    return result;
}