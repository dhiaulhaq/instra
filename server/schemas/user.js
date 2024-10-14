const { GraphQLError } = require("graphql");

const users = [
    {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        password: "123456",
        email: "halo@mail.com",
    },
    {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        password: "123456",
        email: "admin@mail.com",
    },
    {
        id: 3,
        name: "Clementine Bauch",
        username: "Samantha",
        password: "123456",
        email: "other@mail.com",
    },
];

const userTypeDefs = `#graphql
type User {
    id: ID!
    name: String!
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
    userByEmail(email: String!): UserResponse

    userLogin(username: String!, password: String!): UserLoginResponse
}

type Mutation{
    userCreate(input: UserCreateInput): UserMutationResponse
}
`;

const userResolvers = {
    Query: {
        userByEmail: (_, args) => {
            const { email } = args;
            const user = users.find((user) => user.email === email);

            return {
                statusCode: 200,
                data: user,
            }
        },

        userLogin: (_, args) => {
            const { username, password } = args;

            const user = users.find((user) => user.username === username && user.password === password);

            if (!user) {
                throw new GraphQLError('Invalid username or password', {
                    extensions: {
                        http: {
                            status: 401,
                        },
                    },
                });
            }

            return {
                statusCode: 200,
                data: {
                    token: "imagine-a-token",
                },
            };
        },
    },

    Mutation: {
        userCreate: (_, args) => {
            const { input } = args;
            const { name, username, email, password } = input;

            const id = users.length + 1;

            const newUser = {
                name,
                username,
                email,
                password,
            };

            users.push(newUser);

            return {
                statusCode: 200,
                message: `User with id ${id} created successfully`,
            }
        }
    }
};

module.exports = { userTypeDefs, userResolvers };