if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const { responseTypeDefs } = require('./schemas/response');
const { userTypeDefs, userResolvers } = require('./schemas/user');
const { followTypeDefs, followResolvers } = require('./schemas/follow');

const { connect, getDB } = require('./config/mongo-connection');

const authentication = require('./middlewares/authentication');

const server = new ApolloServer({
    typeDefs: [responseTypeDefs, userTypeDefs, followTypeDefs],
    resolvers: [userResolvers, followResolvers]
});

(async () => {
    await connect();
    const db = await getDB();
    const { url } = await startStandaloneServer(server, {
        listen: 3000,
        context: async ({ req, res }) => {
            return {
                authentication: () => authentication(req)
            };
        },
    });

    console.log(`🚀 Server ready at ${url}`);
})();