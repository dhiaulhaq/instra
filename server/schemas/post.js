const { ObjectId } = require('mongodb');
const Post = require('../models/Post');
const redis = require('../config/redis');

const postTypeDefs = `#graphql

type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
}

input CommentInput {
    postId: String!
    content: String!
}

type Like {
    username: String!
    createdAt: String
    updatedAt: String
}

input LikeInput {
    postId: String!
}   

type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: String!
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
    Author: User
}

input PostCreateInput {
    content: String!
    tags: [String]
    imgUrl: String
}

type PostingResult{
    statusCode: Int
    message: String
}

type CommentResult{
    statusCode: Int
    message: String
}

type LikeResult{
    statusCode: Int
    message: String
}

type Query {
    postFetchAll: [Post]
    postDetail(id: String): Post
}

type Mutation {
    postCreate(input: PostCreateInput): PostingResult
    commentPost(input: CommentInput): CommentResult
    likePost(input: LikeInput): LikeResult
}
`;

const postResolvers = {
    Query: {
        postFetchAll: async (_, __, context) => {
            await context.authentication();

            const postCached = await redis.get('posts');

            if (postCached) {
                const posts = JSON.parse(postCached);
                return posts;
            }

            const stages = [
                {
                    $lookup: {
                        from: "users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "Author",
                    },
                },
                {
                    $project: {
                        "Author.password": 0,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $unwind: {
                        path: "$Author",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];

            const posts = await Post.fetchAll(stages);

            if (posts.length > 0) await redis.set("posts", JSON.stringify(posts));

            return posts;
        },

        postDetail: async (_, args) => {
            const { id } = args;
            const stages = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "Author",
                    },
                },
                {
                    $project: {
                        "Author.password": 0,
                    },
                },
                {
                    $unwind: {
                        path: "$Author",
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ];
            const post = await Post.findById(stages);
            return post;
        },
    },

    Mutation: {
        postCreate: async (_, args, context) => {
            const user = await context.authentication();
            const { input } = args;
            const post = await Post.insertPost(input, user);

            await redis.del("posts");

            return {
                statusCode: 200,
                message: post.message,
            };
        },

        commentPost: async (_, args, context) => {
            const user = await context.authentication();
            const { input } = args;
            const comment = await Post.commentPost(input, user);

            return {
                statusCode: 200,
                message: comment.message
            }
        },

        likePost: async (_, args, context) => {
            const user = await context.authentication();
            const { input } = args;
            const like = await Post.likePost(input, user);

            return {
                statusCode: 200,
                message: like.message
            }
        }

    },
};

module.exports = { postTypeDefs, postResolvers }