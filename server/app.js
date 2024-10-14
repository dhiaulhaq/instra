const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');

const { responseTypeDefs } = require('./schemas/response');
const { userTypeDefs, userResolvers } = require('./schemas/user');

const server = new ApolloServer({
    typeDefs: [responseTypeDefs, userTypeDefs],
    resolvers: [userResolvers]
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: 3000,
        context: async ({ req, res }) => {
            console.log('This console will be triggered on every request');

            return {
                dummyFunction: () => {
                    console.log('Read headers ', req.headers);

                    throw new GraphQLError('This is an error', {
                        extensions: {
                            code: 'INTERNAL_SERVER_ERROR',
                        },
                    });
                },
            };
        },
    });

    console.log(`🚀 Server ready at ${url}`);
})();