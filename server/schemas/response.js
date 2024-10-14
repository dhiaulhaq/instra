const responseTypeDefs = `#graphql
interface Response{
    statusCode: String!
    message: String
    error: String
}

type UserLoginData{
    token: String
}

type UserRegisterData{
    name: String
    username: String
    email: String
}

type UserResponse implements Response{
    statusCode: String!
    message: String
    error: String
    data: User
}

type UserLoginResponse implements Response{
    statusCode: String!
    message: String
    error: String
    data: UserLoginData 
}

type UserRegsiterResponse implements Response{
    statusCode: String!
    message: String
    error: String
    data: UserRegisterData 
}

type UserMutationResponse implements Response {
    statusCode: String!
    message: String
    error: String
}
`;

module.exports = { responseTypeDefs };