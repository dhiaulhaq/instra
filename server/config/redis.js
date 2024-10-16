const Redis = require('ioredis');
const redis = new Redis(
    process.env.REDIS_CLI
);

module.exports = redis;
