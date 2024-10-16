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
        console.log(payload);

        const findUsername = await this.getCollection()
            .findOne({ username: payload.username });

        if (findUsername) {
            throw new GraphQLError("Username already exist", {
                extensions: {
                    http: { status: 400 },
                },
            });
        }

        const findEmail = await this.getCollection().findOne({ email: payload.email });

        if (findEmail) {
            throw new GraphQLError("Email already registered", {
                extensions: {
                    http: { status: 400 },
                },
            });
        }

        const email = payload.email;
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        if (!validateEmail(email)) {
            throw new GraphQLError("Invalid email format", {
                extensions: {
                    http: { status: 400 },
                },
            });
        }

        if (payload.password.length < 5) {
            throw new GraphQLError("Password must be at least 5 characters", {
                extensions: {
                    http: { status: 400 },
                },
            });
        }

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

    static async findById(stages) {
        const user = await this.getCollection().aggregate(stages).next();
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