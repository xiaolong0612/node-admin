/*
 * @Description: 
 * @Author: Amber
 * @Date: 2023-06-28 16:15:16
 * @LastEditTime: 2023-08-21 00:01:52
 * @LastEditors: Amber
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// const moment = require('moment')
// console.log(moment(new Date()).toDate())

var indexRouter = require('./routes/index');
var adminsRouter = require('./routes/admins');
var rolesRouter = require('./routes/roles');
var rolesRoutesRouter = require('./routes/roles_routes');
var routersRouter = require('./routes/routers');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var sysConfigRouter = require('./routes/sys_configs');
var uploadRouter = require('./routes/upload');

// const redisClient= require('./utils/redis')
// redisClient.set('test-key-1', 'test-value-1')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/admins', adminsRouter);
app.use('/roles', rolesRouter);
app.use('/rolesRoutes', rolesRoutesRouter);
app.use('/routers', routersRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/sysConfig', sysConfigRouter);
app.use('/upload', uploadRouter);



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
