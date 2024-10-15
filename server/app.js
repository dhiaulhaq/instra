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
                dummyFunction: () => {
                    console.log('Read headers ', req.headers);

                    throw new GraphQLError('This is an error', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                        },
                    });
                },
                db,
            };
        },
    });

    console.log(`🚀 Server ready at ${url}`);
})();