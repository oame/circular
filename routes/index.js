var express = require('express');
var router = express.Router();
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

var twitterConsumerKey = "";
var twitterConsumerSecret = "";

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

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
    failureRedirect: '/' }));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
