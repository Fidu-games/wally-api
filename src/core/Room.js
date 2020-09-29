const Model = require('./Model'),
      uuid = require('uuid-random'),
      MongoManager = require('../infrastructure/MongoManager'),
      RedisManager = require('../infrastructure/RedisManager'),
      Responser = require('../tools/Responser');

class Room extends Model {
    constructor(roomID = '', playersLimit = 6){
        super();
        this.roomID = roomID ? roomID : uuid();
        this.playersLimit = playersLimit;
    }

    asJSON(){
        return {
            roomID: this.roomID,
            limit: this.playersLimit
        }
    }

    static getTempShortCode(digits = 6) {
        let code = '', i, number;
        for(i = 0; i < digits; i++){
            number = Math.floor(Math.random() * 9);
            code += number;
        }
        return code;
    }

    static async createRoom(id, limit){
        let res = new Responser();
        let collection, client;

        try{
            [collection, client] = await MongoManager.getCollection('room');
            let insert = await collection.insertOne({
                roomID: id,
                limit: limit
            });
            if(!insert.result.ok) throw 'The room couldn\'t be registered';

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
            client.close();
        }
        
        return res;
    }

    static async deleteRoom(id){
        let res = new Responser();
        let collection, client;

        try{
            [collection, client] = await MongoManager.getCollection('room');
            let remove = await collection.deleteOne({roomID: id});
            if(!remove) throw 'The room could not be deleted';

            res.setSuccess({
                messages: 'Se ha eliminado el cuarto correctamente'
            });

        }catch(e){
            console.log(e);
            res.errors = e;
        }finally{
            client.close();
        }

        return res;
    }

    static async roomExists(id){
        let res = new Responser();
        try{
            console.log(`Room ID: ${id}`);
            let trueID_cache = await RedisManager.getRoomID(id);
            if(!trueID_cache) throw 'The room doesn\'t have acces or doesn\'t exists';
            res.setSuccess({
                messages: 'the room exists',
                data: { roomID: trueID_cache }
            });
        }catch(e){
            console.log(e);
            res.errors = e;
        }finally{
            return res;
        }
    }
}

module.exports = Room;
