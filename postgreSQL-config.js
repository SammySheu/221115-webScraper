const {Pool} = require('pg');
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

// const connectingURL = process.env.POSTGRESQL_EXTERNAL_URL;
const connectingURL = 'postgres://root:zgU2wzUeX5js7Ozd3gFlplxaolFEFQ6A@dpg-cdt64nha6gdu249fjqe0-a.oregon-postgres.render.com/myanalysisdb';
const pool = new Pool( {
  // connectingURL,
  user: 'root',
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DATABASE,
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
  ssl: true,
} )

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })


module.exports = pool;
