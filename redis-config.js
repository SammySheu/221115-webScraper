const redis = require('redis');


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const redisClient = redis.createClient({
    url: `${process.env.REDIS_INTERNAL_URL}`,
    legacyMode: true
})

redisClient.connect()
    .catch(console.error);

redisClient.on('error', async function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', async function (err) {
    console.log('Connected to redis successfully');
});


module.exports = redisClient;
