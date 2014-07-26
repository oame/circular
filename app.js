var express = require('express')
  , http = require('http')
  , sys = require('sys')
  , oauth = require('oauth');

var app = express();

var _twitterConsumerKey = "KjmpcR0LH6UwOzPp0HhKHqpD2";
var _twitterConsumerSecret = "Sy3qXwGqiChAjnjDvx3A1nq8znF0PekjwZrUk17aGrMEjc5jg4";

function consumer() {
  return new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
    _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://badgestar.com/sessions/callback", "HMAC-SHA1");
}

app.set('port', process.env.PORT || 4321);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.use(express.cookieDecoder());
  app.use(express.session());

  app.locals.pretty = true;
}

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/sessions/connect', function(req, res){
  consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
    }
  });
});

app.get('/sessions/callback', function(req, res){
  sys.puts(">>"+req.session.oauthRequestToken);
  sys.puts(">>"+req.session.oauthRequestTokenSecret);
  sys.puts(">>"+req.query.oauth_verifier);
  consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      // Right here is where we would write out some nice user stuff
      consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          req.session.twitterScreenName = data["screen_name"];
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }
      });
    }
  });
});

app.listen(parseInt(process.env.PORT || 80));
