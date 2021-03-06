const createError = require('http-errors');
const express = require('express');
const exhbs = require('express-handlebars')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)

// Routes
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin')
const authRouter = require("./routes/auth");
const { collection } = require('./models/Admin');
const app = express();
const auth = require("./middleware/auth")


app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/admin:any', express.static(path.join(__dirname, 'public')));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', exhbs({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
  extname: 'hbs',
  partialsDir: [
    path.join(__dirname, 'views/partials'),
  ],
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  }
}))

// MongoDb Connection
require('./helper/db')()

var store = new MongoDBStore({
  uri: "mongodb+srv://texnar1225:texnar1225@cluster0.ov7ap.mongodb.net/Food",
  collection: "Sessions"
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: "KALIT",
  resave: false,
  saveUninitialized: false,
  store,
}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin',auth, adminRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;