const { ObjectId } = require('mongodb');
const { GraphQLError } = require("graphql");
const { database } = require('../config/mongo-connection');

class Post {
    static getCollection() {
        return database.collection('posts');
    }

    static async fetchAll(stages) {
        const posts = await this.getCollection().aggregate(stages).toArray();
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

    static async findById(stages) {
        const post = await this.getCollection().aggregate(stages).next();

        if (!post) {
            throw new GraphQLError("Post not found", {
                extensions: {
                    http: { status: 404 },
                },
            });
        }

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
        const post = await this.getCollection().findOne({
            _id: new ObjectId(input.postId)
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const userLikeIndex = post.likes.findIndex(
            (like) => like.username === user.username
        );

        if (userLikeIndex !== -1) {
            await this.getCollection().updateOne(
                { _id: new ObjectId(input.postId) },
                { $pull: { likes: { username: user.username } } }
            );

            return {
                message: 'Unliking post'
            }

        } else {
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
}

module.exports = Post;