const { ObjectId } = require('mongodb');
const { GraphQLError } = require("graphql");
const { database } = require('../config/mongo-connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    static getCollection() {
        return database.collection('users');
    }

    static async register(payload) {
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        await this.getCollection().insertOne({
            ...payload,
            password: hashedPassword,
        });

        return {
            message: 'User has been created successfully',
        };
    }

    static async login(username, password) {
        const user = await this.getCollection().findOne({
            "username": username
        });

        if (!user) {
            throw new GraphQLError('Invalid username or password', {
                extensions: {
                    http: {
                        status: 401,
                    },
                },
            });
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new Error('Invalid password');
        }

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name
        }

        const access_token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

        return {
            statusCode: 200,
            token: access_token,
        };
    }

    static async fetchAll() {
        const users = await this.getCollection().find().toArray();
        return users;
    }

    static async findById(id) {
        const user = await this.getCollection().findOne({
            _id: new ObjectId(id)
        });

        return user;
    }

    static async findByName(name) {
        const users = await this.getCollection().find({
            "name": { $regex: new RegExp(name, 'i') }
        }).toArray();

        return users;
    }
}

module.exports = User;