var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//require('dotenv').config(); ADD a .env file with zwsid and uncomment this

var app = express();
var port = process.env.PORT || 3000;


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));


// error handlers

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

var apis = require("./server/routes/api");
app.use('/api', apis);


/* ROUTES */
app.get('/', function (req, res) {
    res.sendFile(path.resolve('client/views/index.html'));
})




app.listen(port);

module.exports = app;
