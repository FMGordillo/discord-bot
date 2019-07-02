require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const bot = require("./utils/botInit");
const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const indexRoute = require("./routes/index")(bot);

app.use("/", indexRoute);

// Catch a 404 error, and FW to the next
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
