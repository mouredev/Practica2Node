const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Cargamos el conector a la base de datos. No lo asignamos, solo queremos que se ejecute
require('./lib/connectMongoose');

const index = require('./routes/index');

const app = express();

// i18n conf
const i18n = require('i18n');
i18n.configure({
  locales: ['es', 'en'],
  directory: './locales',
  defaultLocale: 'es'
});
app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// Rutas del APIv1
app.use('/apiv1/users', require('./routes/apiv1/users'));
app.use('/apiv1/advertisements', require('./routes/apiv1/advertisements'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  // Express-Validator tiene un array
  if (err.array) {
    err.status = 422; // Unprocessable Entity
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = isAPI(req) ?
      { message: 'Not valid', errors: err.mapped() } : // Para peticiones de API
      `Not valid - ${errInfo.param} ${errInfo.msg}`; // Para otras peticiones
  }

  res.status(err.status || 500);

  if (isAPI(req)) { // Si es un API, devuelvo JSON
    res.json({ success: false, error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page  
  res.render('error');
});

function isAPI(req) {
  return req.originalUrl.indexOf('/apiv') === 0;
}

module.exports = app;