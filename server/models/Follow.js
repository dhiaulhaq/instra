const { ObjectId } = require('mongodb');
const { GraphQLError } = require("graphql");
const { database } = require('../config/mongo-connection');

class Follow {
    static getCollection() {
        return database.collection('follows');
    }

    static async followUser(input) {
        const result = await this.getCollection().insertOne({
            ...input,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return result;
    }
}

module.exports = Follow;