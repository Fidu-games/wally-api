const Model = require('./Model'),
      uuid = require('uuid-random'),
      MongoManager = require('../infrastructure/MongoManager'),
      RedisManager = require('../infrastructure/RedisManager'),
      Responser = require('../tools/Responser'),
      config = require('../../config');

class Room extends Model{
    constructor(roomID = '', playersLimit = 6){
        this.roomID = roomID != '' ? roomID : uuid();
        this.playersLimit = playersLimit;
    }

    asJSON(){
        return {
            roomID: this.roomID,
            limit: this.playersLimit
        }
    }

    static getTempShortCode(digits = 6){
        let code = '', i, number;
        for(i = 0; i < digits; i++){
            number = Math.floor(Math.random() * 9);
            code += number;
        }
        return code;
    }

    static async createRoom(id, limit){
        let res = new Responser();

        try{
            let client = await MongoManager.getClient();
            let db = client.db(config.database.mongo.db);
            let collection = db.collection('room');
            let insert = await collection.insertOne({
                roomID: id,
                limit: limit
            });
            if(!insert.result.ok) throw 'The room couldn\'t be registered';

            client.close();

            let short = Room.getTempShortCode();
            let codeRegistResult = await RedisManager.setRoomShortCode(short, id);
            if(!codeRegistResult) throw 'The room couldn\'t be registered';

            res.setSuccess({
                messages: 'The room has been registered',
                data: {
                    shortRoomID: short,
                    roomID: id
                }
            });
        }catch(e){
            console.log(e);
            res.errors = e;
        }finally{
            return res;
        }
    }

    static async deleteRoom(id){
        let res = new Responser();

        try{
            let client = await MongoManager.getClient();
            let db = client.db(config.database.mongo.db);
            let query = {roomID: id};
            let remove = await db.collection('room').deleteOne(query);
            if(!remove) throw 'The room could not be deleted';

            res.setSuccess({
                messages: 'Se ha eliminado el cuarto correctamente'
            });

            client.close();
        }catch(e){
            res.errors = e;
            console.log(e);
        }finally{
            return res;
        }
    }
}

module.exports = Room;
