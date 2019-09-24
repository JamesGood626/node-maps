const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cookieSession = require("cookie-session");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const initializePassport = require("./passport/passport");
// const indexRouter = require('./routes/index');
const usersRouter = require("./routes/user/users");
const eventsRouter = require("./routes/events/events");

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // TODO: check if not in test env to log this.
    // console.log("MongoDB Connected");
  })
  .catch(error => {
    console.log("Error: ", error);
  });

var app = express();

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

// TODO: delete all view related files/dirs/dependencies
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
initializePassport(passport);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ message: "Got response from GET /" }));
// app.use('/', indexRouter);
app.use("/api/users/", usersRouter);
app.use("/api/events", eventsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
