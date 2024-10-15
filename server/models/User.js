const { ObjectId } = require('mongodb');
const { database } = require('../config/mongo-connection');
const bcrypt = require('bcryptjs');

class User {
    static getCollection() {
        return database.collection('users');
    }

    static async insertOne(payload) {
        console.log(payload);

        const hashedPassword = await bcrypt.hash(payload.password, 10);

        await this.getCollection().insertOne({
            ...payload,
            password: hashedPassword,
        });

        return {
            message: 'User has been created successfully',
        };
    }

    static async find() {
        const users = await this.getCollection().find().toArray();
        return users;
    }

    static async findOne(condition) {
        const user = await this.getCollection().findOne(condition);
        return user;
    }

    static async findById(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        await this.getCollection().updateOne(
            { _id: new ObjectId(id) },
            { $set: payload }
        );

        return {
            message: 'User has been updated successfully',
        };
    }
}

module.exports = User;