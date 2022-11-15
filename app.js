var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash');
const session  = require('express-session');
const connectRedis = require('connect-redis');
const passport = require('passport');
let RedisStore = connectRedis(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var passportFunction = require('./passport-config');
var redisClient = require('./redis-config');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 3 // session max age in milliseconds
  }
}))
app.use( flash() );

app.use( passport.initialize() );
app.use( passport.session() );

passportFunction(passport);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
