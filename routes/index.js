var express = require('express');
var router = express.Router();
var passport = require('passport');
const flash = require('express-flash');
const fs = require('fs/promises');
const pool = require('../postgreSQL-config');
const bcrypt = require('bcrypt');

let successMessage;
/* GET home page. */
router.get('/', function(req, res, next) {
  return res.redirect('/login');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
  if(successMessage) {
    res.render('login', {message_success: successMessage});
    successMessage = undefined;
  }
  else res.render('login');
  // successMessage = undefined;
});

router.get('/register', checkNotAuthenticated, (req, res) => {
  return res.render('register');
})

router.get('/table', checkAuthenticated, async (req, res) => {
  try{
      let dataset = await fs.readFile('./data.txt', { encoding: 'utf8' });
      dataset = JSON.parse(dataset);
      // console.log(req.user.user);
      res.render('tableView', {dataset, name: req.user.name});
      // res.render('tableView');
  }
  catch(err) {
      console.log(err);
  }
});

router.post('/login',
  passport.authenticate('local', {
          successRedirect: '/table',
          failureRedirect: '/login', 
          failureFlash: true })
  // async (req, res) => {
  //     const { email, password} = req.body;
  //     const sess = req.session;
  //     sess.email = email;
  //     sess.password = password;
  //     console.log(sess.email, sess.password);
  //     // return res.end();
  //     // return res.redirect('/table');
  // }
  );

router.post('/testSession', (req, res) => {
  const sess = req.session;
  console.log(req.session.user, req.session.password);
  return res.send('success to store user information into session');
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try{
      const id = Date.now().toString();
      const hashedPassword = await bcrypt.hash(req.body.registPassword, 10);
      //-------------------------Insert Data in PostgreSQL-----------------
      // let sql = `INSERT INTO userInformationTable (id, name, email, password) VALUES ("${id}", "${req.body.registUser}", "${req.body.registEmail}", "hello")`    
      const newClient = await pool.connect();
      await newClient.query('INSERT INTO userinfotable (id, name, email, password) VALUES ($1, $2, $3, $4)', [id, req.body.registUser, req.body.registEmail, hashedPassword] );
      newClient.release();
      successMessage = 'Succeed to register. Now log in!' ;

      
      // pool.connect()
      //   .then(client => {
      //       return client
      //               .query('INSERT INTO userinfotable (id, name, email, password) VALUES ($1, $2, $3, $4)', [id, req.body.registUser, req.body.registEmail, hashedPassword] )
      //               .then(res => {
      //                       client.query('SELECT * FROM userinfotable;')
      //                         .then( (show) => console.log(show.rows))
      //                       client.release()
      //                       console.log(res)
      //                   })
      //               .catch(err => {
      //                       client.release()
      //                       console.log(err.stack)
      //                   })
      // })
      return res.redirect('/login');
  }catch(err){
      res.redirect('/register')
      console.log(err);
  }
});

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
      if (err) return console.log(err);
  });
  req.logOut( (err) => {
      if (err) return next(err);
  });
  return res.redirect('/login');
})

function checkAuthenticated(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next){
  if(req.isAuthenticated()){
      return res.redirect('/table');
  }
  next();
}

module.exports = router;
