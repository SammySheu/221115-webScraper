
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const pool = require('./postgreSQL-config');



function functionAll(passport){
    const authenticateUser = async (email, password, done) => {
        try{
            const userFromMySQL = await getUserByEmail(email);
            if(userFromMySQL == null){
                return done(null, false, {message: 'No user with that name'});
            }
            else if( await bcrypt.compare(password, userFromMySQL.password) ){
                return done(null, userFromMySQL);
            }
            else {
                return done(null, false, {message: 'Password incorrect'});
            }
        } catch(error){
            return done(error);
        }
    }

    passport.use(
        new LocalStrategy( 
            { usernameField: 'email'}, authenticateUser
        )
    )

    // to store inside session
    passport.serializeUser( (user, done) => {
        return done(null, user.id);
    })
    passport.deserializeUser( async (id, done) => {
        return done(null, await getUserById(id));
    })

    async function getUserByEmail(email){
        try{
            const newClient = await pool.connect();
            const res = await newClient.query('SELECT * FROM userinfotable WHERE email = $1', [email]);
            // console.log(res);
            newClient.release();
            return res.rows[0];
        } catch(err) {
            return console.log(err);
        }
    }

    async function getUserById(id){
        try{
            const newClient = await pool.connect();
            const res = await newClient.query('SELECT * FROM userinfotable WHERE id = $1', [id]);
            // console.log(res);
            newClient.release();
            return res.rows[0];
        } catch(err) {
            return console.log(err);
        }
    }
}


module.exports = functionAll;