const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const nocache = require('nocache');
const port = process.env.PORT || 5000;


const showingsRoutes = require('./api/showings');
const userRoutes = require('./api/user');
const authRoutes = require('./api/auth');
const reservation = require('./api/reservations');
const tmdb = require('./api/tmdb');
const settings = require('./api/settings');

const sequelize = require('./models');


const winston = require('winston')
const consoleTransport = new winston.transports.Console()
const myWinstonOptions = {
    transports: [consoleTransport]
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next) {
  logger.info(req.url)
  next()
}
app.use(logRequest)

function logError(err, req, res, next) {
  logger.error(err)
  next()
}
app.use(logError)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(nocache());
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api/v1/showings', showingsRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reservation', reservation);
app.use('/api/v1/tmdb', tmdb);
app.use('/api/v1/settings', settings);


// Serve any static files
app.use("", express.static(path.join(__dirname, "client/build")));


app.get("/api/v1/email", (req, res) => {
  testSendEmail();
  res.send("email sent");
})

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });

app.use((error, req, res, next) => {
    console.log("error handler called")
    // Sets HTTP status code
    if (error.status) {
      console.log(error)
      res.status(error.status)
    } else {
      res.status(500)
    }
    // Sends response
    res.json({
      status: error.status,
      message: error.message,
      stack: error.stack
    })
  })

async function createSetting(setting) {
  let dbSetting = await sequelize.models.settings.findByPk(setting.key)
  if (!dbSetting) {
    dbSetting = await sequelize.models.settings.create(setting)
  }
}

let initialSettings = [
  {"key": "theater_name", "value": "homeflix.io", "type": "string"},
  {"key": "theater_layout", "value": "{}", "type": "json"},
  {"key": "first_time_settings_complete", "value": "false", "type": "boolean"},
  {"key": "first_time_layout_complete", "value": "false", "type": "boolean"},
  {"key": "first_time_admin_complete", "value": "false", "type": "boolean"},
  {"key": "smtp_enabled", "value": "false", "type": "boolean"},
  {"key": "smtp_server", "value": null, "type": "string"},
  {"key": "smtp_username", "value": null, "type": "string"},
  {"key": "smtp_password", "value": null, "type": "string"},
  {"key": "smtp_port", "value": null, "type": "integer"},
  {"key": "smtp_tls", "value": "false", "type": "boolean"},
  {"key": "smtp_from_email", "value": null, "type": "string"},
  {"key": "smtp_from_name", "value": null, "type": "string"},
  {"key": "smtp_test_recipient", "value": null, "type": "string"},
]

initialSettings.map(setting => createSetting(setting))
