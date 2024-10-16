const { ObjectId } = require('mongodb');
const { GraphQLError } = require("graphql");
const { database } = require('../config/mongo-connection');

class Post {
    static getCollection() {
        return database.collection('posts');
    }

    static async fetchAll() {
        const posts = await this.getCollection().find().toArray();
        return posts;
    }

    static async insertPost(payload, user) {
        await this.getCollection().insertOne({
            ...payload,
            authorId: new ObjectId(user.userId),
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            message: 'Post has been created successfully',
        };
    }

    static async findById(id) {
        const post = await this.getCollection().findOne({
            _id: new ObjectId(id)
        });

        return post;
    }

    static async commentPost(input, user) {
        await this.getCollection().updateOne({
            _id: new ObjectId(input.postId)
        },
            {
                $push: {
                    comments: {
                        content: input.content,
                        username: user.username,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
            }
        );

        return {
            message: 'Success adding comment'
        }
    }

    static async likePost(input, user) {
        await this.getCollection().updateOne({
            _id: new ObjectId(input.postId)
        },
            {
                $push: {
                    likes: {
                        username: user.username,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                }
            }
        );

        return {
            message: 'Success like post'
        }
    }
}

module.exports = Post;