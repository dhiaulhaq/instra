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
    userFetchAll: [User]
    userDetail(id: String): UserDetail
    userSearch(keyword: String!): [User]
}

type Mutation{
    userLogin(username: String!, password: String!): UserLoginResponse
    userCreate(input: UserCreateInput): UserMutationResponse
}
`;

const userResolvers = {
    Query: {
        userFetchAll: async () => {
            try {
                const users = await User.fetchAll();
                return users;
            } catch (error) {
                throw error;
            }
        },

        userDetail: async (_, args, context) => {
            try {
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
            } catch (error) {
                throw error;
            }
        },


        userSearch: async (_, args) => {
            try {
                const { keyword } = args;
                const users = await User.findUsers(keyword);

                return users;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation: {
        userLogin: async (_, args) => {
            try {
                const { username, password } = args;
                const user = await User.login(username, password);

                return {
                    message: 'Success login!',
                    statusCode: user.statusCode,
                    data: {
                        token: user.token
                    },
                }
            } catch (error) {
                throw error;
            }
        },

        userCreate: async (_, args) => {
            try {
                const { input } = args;
                const user = await User.register(input);
                return {
                    statusCode: 200,
                    message: user.message,
                };
            } catch (error) {
                throw error;
            }
        },

    },
};

module.exports = { userTypeDefs, userResolvers };