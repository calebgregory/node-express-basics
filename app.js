// npm requires //

var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var lessCSS = require('less-middleware');
var morgan = require('morgan');
var path = require('path');


// route requires //

var routes = require('./routes/index');
var pizza = require('./routes/pizza');
var chickennuggets = require('./routes/chickennuggets');
var imgurUp = require('./routes/imgurUp');


// variables //

var app = express();
require(path.join(process.cwd(),'/lib/secrets'));
require(path.join(process.cwd(),'/lib/mongodb'));


// settings //

// tell node we have a rendering engine available to us
app.set('view engine', 'ejs');
app.set('case sensitive routing', true);


// locals //

// these are constants for the lifecycle of the app
app.locals.title = 'myapp.co';


// middlewares //

//// we put our logger before all other route handling,
//// even static imports, so that it handles all requests
//app.use(function(req, res, next) {
//  console.log('Request at '+ new Date().toISOString());
//  next(); // call next from within middlewares so that
//          // we can continue the chain of events
//});

// creates a new route that, when receives a route request,
// compiles less and responds with the compiled css to the
// browser
app.use(lessCSS('public'));

// we use morgan for logging - morgan is strictly for incoming requests
// 'dev' logs a basic output ('tiny') with colors,
// 'combined' logs the apache output
// 'common' logs a shorter version of the above
// 'short' and 'tiny' are also options
// logs are extremely valuable if you have a long-running server
var logStream = fs.createWriteStream('access.log', {flags : 'a'}); // -a : append-mode
app.use(morgan('combined', { stream : logStream })); // writes logs in apache format to log file
app.use(morgan('dev')); // writes logs in dev format to the console

// we can create a loggly client with whatever tag we choose
// to specify the type of log that is occurring. here is one for
// incoming requests to our server:
app.use(function(req, res, next) {
  var client = require('./lib/loggly')('incoming');
  client.log({
    ip     : req.ip,
    date   : new Date(),
    url    : req.url,
    status : res.statusCode,
    method : req.method
  });
  next();
});

// to serve static files, such as images, css, js, or
// other files, use
app.use(express.static('public'));

// we use body-parser for accepting or being able to parse
// any form that passes through our server
app.use(bodyParser.urlencoded({
  extended : true,
  type     : '*/x-www-form-urlencoded'
}));


// routes //

app.use('/', routes);
app.use('/pizza', pizza);
app.use('/chickennuggets', chickennuggets);
app.use('/imgur', imgurUp);


// errors //

// any 404 handling we will do must take place
// after valid routes - order dictates precedence
app.use(function(req,res,next) {
  // place 400 (client) errors before 500 (server) errors
  res.status(403).send('Unauthorized');
});

// *so, we create an error handler, passing 4 arguments
// to create error-handling middleware
app.use(function(err, req, res, next) {
  // here is another loggly client for specifically created
  // to handle error logs
  var client = require('./lib/loggly')('error');
  client.log({
    ip     : req.ip,
    date   : new Date(),
    url    : req.url,
    status : res.statusCode,
    method : req.method,
    error  : err
  });
  var errStream = fs.createWriteStream('errors.log', {flags : 'a'});
  errStream.write(err+'\n'+err.stack+'\n');
  res.status(500).send('[Error message]');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
