const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const { database } = require('../config/mongo-connection');
const { ObjectId } = require('mongodb');

const authentication = async (req) => {
    if (!req.headers.authorization) {
        throw new Error('Unauthorized');
    }

    let token = req.headers.authorization.split(" ");
    if (token.length < 1) {
        throw new Error("Unauthorized");
    }

    token = token[1];

    const verifyToken = jwt.verify(token, secretKey);
    const user = await database.collection('users').findOne({
        _id: new ObjectId(verifyToken.id)
    });

    const userInfo = {
        userId: user._id,
        username: user.username,
        email: user.email,
        name: user.name
    }

    return userInfo;
}

module.exports = authentication;