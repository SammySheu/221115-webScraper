const postgre = require('pg');

const pool = new postgre.Pool( {
    url: `${process.env.POSTGRESQL_EXTERNAL_URL}`,
    database: 'userinf',
} )

// pool.connect()

// postgreClient.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to postgreSQL successfully");
//   });


// let quote = " \conninfo ";
// // let quote = 'SELECT * FROM userinftable';
// // // let quote = "DELETE FROM userinftable WHERE name='sam'; ";
// const ttt = postgreClient.query(quote)
//       .then(ttt=> console.log(ttt));
// console.log(ttt);


module.exports = pool;
