
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const pool = require('./postgreSQL-config');



function functionAll(passport){
    const authenticateUser = async (email, password, done) => {
        const userFromMySQL = await getUserByEmail(email);
        if(userFromMySQL == null){
            return done(null, false, {message: 'No user with that name'});
        }
        try{
            if( await bcrypt.compare(password, userFromMySQL.password) ){
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

    function getUserByEmail(email){
        const currentUser = async () => {
            let sql = `SELECT * FROM userinftable WHERE email='${email}';`;
            const found = await pool.query(sql);
            // console.log(found.rows[0]);
            return found.rows[0];
        }
        return currentUser();
    }

    function getUserById(id){
        const currentUser = async () => {
            let sql = `SELECT * FROM userinftable WHERE id='${id}';`;
            const found = await pool.query(sql);
            // console.log(found.rows[0]);
            return found.rows[0];
        }
        return currentUser();
    }
}




module.exports = functionAll;