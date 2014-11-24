var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var app = express();

// view engine setup
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

var routes = require('./routes/index');
var users = require('./routes/users');

var twitterConsumerKey = "KjmpcR0LH6UwOzPp0HhKHqpD2";
var twitterConsumerSecret = "Sy3qXwGqiChAjnjDvx3A1nq8znF0PekjwZrUk17aGrMEjc5jg4";

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'secret',
                 saveUninitialized: true,
                 resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new TwitterStrategy({
    consumerKey: twitterConsumerKey,
    consumerSecret: twitterConsumerSecret,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log(token);
    done();
  }
));

app.use('/', routes);
app.use('/users', users);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
    failureRedirect: '/' }));

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

