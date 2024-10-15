const Follow = require('../models/Follow');

const followTypeDefs = `#graphql

input FollowCreateInput {
    followingId: String!
    followerId: String!
}

type FollowingResult{
    statusCode: String
    message: String
}

type Mutation {
    followCreate(input: FollowCreateInput): FollowingResult
}
`;

const followResolvers = {
    Mutation: {
        followCreate: async (_, args) => {
            const { input } = args;
            await Follow.followUser(input);

            return {
                statusCode: 200,
                message: `Success following ${input.followingId}`
            };
        },

    },
};

module.exports = { followTypeDefs, followResolvers };