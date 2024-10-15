const User = require('../models/User');

const userTypeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
    password: String!
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

    userDetail(id: String): User

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

        userDetail: async (_, args) => {
            const { id } = args;
            const user = await User.findById(id);
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