const {Pool} = require('pg');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
// const fs = require('fs');


// const connectingURL = process.env.POSTGRESQL_EXTERNAL_URL;
const pool = new Pool( {
  // connectingURL,
  user: 'root',
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized : false,
  },
} )

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


module.exports = pool;
