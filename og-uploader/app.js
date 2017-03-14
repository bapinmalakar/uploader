var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var route = require('./routes/routelist');


var app = express();

app.use(logger('dev'));
app.use('/img', express.static(path.join(__dirname, '/public/uploads')));
app.use('/', route);
// Mongoose configuration
mongoose.connect('mongodb://localhost:27017/uploadservice');
var db = mongoose.connection;
mongoose.set('debug', true);
db.on('error', console.error.bind(console, 'Error Due to database Connection'))
db.once('open', () => console.log('Database Connection Done Successfully'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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