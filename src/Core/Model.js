const Responser = require('../tools/Responser'),
      config = require('../../config');

class Model{
    constructor(){
        this.mongo = {};
        this.mongo.db = config.database.mongo.db;
    }

    setOutput(){
        this.output = new Responser();
    }

    getOutput(){
        return this.output;
    }

    setError(error){
        if(!this.output){
            this.setOutput()
        }
        this.output.errors = error;
    }
}

module.exports = Model;