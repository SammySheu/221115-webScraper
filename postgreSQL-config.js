const postgre = require('pg');

const postgreClient = new postgre.Client( {
    url: `${process.env.POSTGRESQL_INTERNAL_URL}`,
    database: 'userinf',
} )

// pool.connect()

postgreClient.connect(function(err) {
    if (err) throw err;
    console.log("Connected to postgreSQL successfully");
  });

// let quote = 'SELECT * FROM userinftable';
// // let quote = "DELETE FROM userinftable WHERE name='sam'; ";
// const ttt = postgreClient.query(quote)
//       .then(ttt=> console.log(ttt));
// console.log(ttt);


module.exports = postgreClient;
