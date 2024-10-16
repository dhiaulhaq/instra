const Post = require('../models/Post');

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
        postFetchAll: async () => {
            const posts = await Post.fetchAll();
            return posts;
        },

        postDetail: async (_, args) => {
            const { id } = args;
            const post = await Post.findById(id);
            return post;
        },
    },

    Mutation: {
        postCreate: async (_, args, context) => {
            const user = await context.authentication();
            const { input } = args;
            const post = await Post.insertPost(input, user);
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