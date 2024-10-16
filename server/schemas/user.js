const { ObjectId } = require('mongodb');
const User = require('../models/User');

const userTypeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
}

type UserDetail {
    _id: ID!
    name: String
    username: String!
    email: String!
    Followings: [User]
    Followers: [User]
}

input UserCreateInput {
    name: String
    username: String!
    email: String!
    password: String!
}

type Query{
    userSearch(name: String!): UserResponse
    userFetchAll: [User]
    userDetail(id: String): UserDetail
    userByName(name: String!): [User]
}

type Mutation{
    userLogin(username: String!, password: String!): UserLoginResponse
    userCreate(input: UserCreateInput): UserMutationResponse
}
`;

const userResolvers = {
    Query: {
        userFetchAll: async () => {
            const users = await User.fetchAll();
            return users;
        },

        userDetail: async (_, args, context) => {
            await context.authentication();
            const { id } = args;

            const stages = [
                {
                    $match: {
                        _id: new ObjectId(id),
                    },
                },

                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "followerId",
                        as: "Followings",
                    },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "Followings.followingId",
                        foreignField: "_id",
                        as: "Followings",
                    },
                },

                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "followingId",
                        as: "Followers",
                    },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "Followers.followerId",
                        foreignField: "_id",
                        as: "Followers",
                    },
                },

                {
                    $project: {
                        password: 0,
                        "Followings.password": 0,
                        "Followers.password": 0,
                    },
                },
            ];

            const user = await User.findById(stages);

            return user;
        },


        userByName: async (_, args) => {
            const { name } = args;
            const users = await User.findByName(name);
            return users;
        }
    },

    Mutation: {
        userLogin: async (_, args) => {
            const { username, password } = args;
            const user = await User.login(username, password);

            return {
                message: 'Success login!',
                statusCode: user.statusCode,
                data: {
                    token: user.token
                },
            }
        },

        userCreate: async (_, args) => {
            const { input } = args;
            const user = await User.register(input);
            return {
                statusCode: 200,
                message: user.message,
            };
        },

    },
};

module.exports = { userTypeDefs, userResolvers };