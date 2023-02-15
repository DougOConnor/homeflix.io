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
    // Sets HTTP status code
    if (error.status) {
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
  