const postgre = require('pg');

const pool = new postgre.Pool( {
    url: `${process.env.POSTGRESQL_INTERNAL_URL}`,
    database: 'userinf',
} )

// pool.connect()

pool.on('connect', async function (err) {
    console.log('Connected to postgreSQL successfully');
});



module.exports = pool;
