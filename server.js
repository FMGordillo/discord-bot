require("dotenv").config();
const path = require("path");
const bot = require("./bot");
const express = require("express");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const createError = require("http-errors");


const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT || "local",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
})

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// TODO for DB!!!!
// console.log("IS THIS WORKING", process.env.IS_DOCKER_ENV);

const indexRoute = require("./routes/index")(bot);

app.use("/", indexRoute);

app.use(Sentry.Handlers.errorHandler());

// Catch a 404 error, and FW to the next
app.use(function (_req, _res, next) {
  next(createError(404));
});

app.use(function (_err, _req, res, _next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  // // render the error page
  // res.render("error");  res.status(err.status || 500);

  res.statusCode = 500;
  res.end(res.sentry + "\n");

});

module.exports = app;
