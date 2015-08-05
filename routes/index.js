var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.get('/hello', function (req, res) {
  res.send('Hello!');
});

// here is an example for how to import ejs
// this will look for the folder 'views' and from there
// we utilize whatever template we write
router.get('/favoritethings', function (req, res) {
  var favoriteThings = [
    'raindrops on roses',
    'whiskers on kittens',
    'healthy ambition',
    'space jam'
  ];

  res.render('templates/world', {
    welcome : '[Welcome message]',
    favoriteThings : favoriteThings
  });
});


// you can send json objects using express
// and express interprets the 'Content-Type'
// using context
router.get('/json', function(req, res) {
  res.send({ 'an' : 'object' });
});

// we want our app to handle errors without sending
// the user a stack trace*
router.get('/thisshoulderror', function(req, res) {
  res.send(badVariable);
});

module.exports = router;
