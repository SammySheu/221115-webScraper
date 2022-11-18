const {Pool} = require('pg');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const connectingURL = process.env.POSTGRESQL_EXTERNAL_URL;
const pool = new Pool( {
  connectingURL,
  user: 'root',
  database: 'userinf',
} )

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


module.exports = pool;
