const { ObjectId } = require('mongodb');
const { database } = require('../config/mongo-connection');

class Follow {
    static getCollection() {
        return database.collection('follows');
    }

    static async followUser(input, user) {
        const followPayload = {
            followingId: new ObjectId(input.followingId),
            followerId: user.userId,
        }

        const findFollowedUser = await this.getCollection().findOne(followPayload);

        if (findFollowedUser) {
            await this.getCollection().deleteOne(followPayload);

            return "Unfollowing User";

        } else {
            await this.getCollection().insertOne({
                ...followPayload,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            return "Following User";
        }
    }
}

module.exports = Follow;