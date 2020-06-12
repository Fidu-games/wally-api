const config = require('../../config'),
      mongodb_client = require('mongodb').MongoClient;

class MongoManager{

    static async getClient(){
        let client = await mongodb_client.connect(config.database.mongo.url, config.database.mongo.options);
        return MongoManager.evalClient(client);
    }

    static evalClient(client){
        if(!client){
            throw "No se logro conectar con la base de datos";
        }
        return client;
    }

    static async emailExists(email){
        let result, client;

        try{
            client = await MongoManager.getClient();
            let db = client.db(config.database.mongo.db);
            let collection = db.collection('user');
            let query = await collection.findOne({email: email});
            result = query;
            client.close();
        }catch(e){
            console.log(e);
        }finally{
            return result;
        }
    }
}

module.exports = MongoManager;