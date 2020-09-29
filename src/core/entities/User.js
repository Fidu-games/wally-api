const {performQuery} = require('../../infrastructure/MongoManager'),
      {ResourceNotExists} = require('../../errors/resourceErrors');

class User {
    /**
     * @param {String} userID
     * @param {String} name
     * @param {String} nickname
     * @param {String} email
     */
    constructor(userID, email= '', name = '', nickname= '') {
        this.userID = userID;
        this.name = name;
        this.nickname = nickname;
        this.email = email;
    }

    /**
     *
     * @param {String} name
     * @param {String} nickname
     * @returns {Promise<Responser>}
     */
    async createUser(name, nickname) {
        let user = new User(this.userID, this.email, name, nickname);
        return await performQuery(
            'user',
            async collection => (
                await collection.insertOne(user)
            )
        )
    }

    /**
     *
     * @param {String} userID
     * @returns {Promise<Responser>}
     */
    static async getUser(userID) {
        return await performQuery(
            'user',
            async collection => {
                let query = await collection.findOne({userID});
                if(!query) throw new ResourceNotExists('user', userID);
                return query;
            }
        )
    }
}

module.exports = User;
