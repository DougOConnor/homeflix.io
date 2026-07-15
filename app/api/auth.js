const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
//const GoogleStrategy = require('passport-google-oidc');
const crypto = require('crypto');

const { models } = require("../models")


const express = require('express');
const router = express.Router();

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'not-configured'});


passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // The very first account on a fresh install becomes the admin
        const userCount = await models.user.count();
        const user = await models.user.create({ email, password, is_admin: userCount === 0 });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await models.user.findOne({ where: {email: email} });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const validate = await user.validatePassword(password);
        if (validate === false) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);



router.post('/signup', function(req, res, next){
  passport.authenticate('signup', function(err, user, info) {
    if (user) {
      return res.send({message: 'Signup successful', user: {user_id: user.user_id, email: user.email}});
    }
    const message = (info && info.message) || (err && err.message) || 'Signup failed';
    res.status(401);
    return res.send({message: 'Signup failed', error: message});
  } )(req, res, next);
} );

router.post('/login', function(req, res, next){
  passport.authenticate('login', function(err, user, info) {
    if (user) {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.redirect('/success/');
      });
    } else {
      // set 401 status code
      res.status(401);
      return res.send({message: 'Login failed', error: info.message});
    }
  } )(req, res, next);
} ); 

router.post('/reset-password', async function(req, res, next){
  // Reset Password
  const token = crypto.randomBytes(128).toString('hex');
  const user = await models.user.findOne({ where: { email: req.body.email } })
  user.update({ reset_token: token }, { where: { email: req.body.email } })

  let url = 'http://localhost:8080/password-reset?token=' + token + '&email=' + req.body.email

  await mg.messages.create('my.asynctech.io',{
    from: "Async Technology Support <contact@asynctech.io>",
    to: req.body.email,
    subject: "Password Reset Request",
    template: "generic-password-reset",
    'h:X-Mailgun-Variables': {RESET_URL: url}
  })
  console.log(url)
  res.send(token)
})

router.post('/reset-password/:email', async function(req, res, next){
  // Reset Password
  const email = req.params.email;
  const user = await models.user.findOne({ where: { email: email } })
  if (user.validateResetToken(req.body.token)) {
    user.update({ password: req.body.password, reset_token: null }, { where: { email: email } }).then(() => {
    });
    
    res.send({"message": "Password reset successful"})
  }

})


// Configure the Google Strategy
/*
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/api/v1/auth/oauth2/redirect/google',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  // Find Federated Credential
  models.federated_credential.findOne({ where: {provider: issuer, subject: profile.id} }).then((record) => {
    if (!record) {
      // If Federated Credential does not exist, create a new User and Federated Credential
      models.user.create({ name: profile.displayName }).then((user) => {
        models.federated_credential.create({ user_id: user.user_id, provider: issuer, subject: profile.id }).then((record) => {
          return cb(null, user);
        });
      });
    } else {
      // If Federated Credential exists, find the User
      models.user.findOne({ where: {user_id: record.user_id} }).then((user) => {
        return cb(null, user);
      });
    }
  });
}));

// Google Login Page
router.get('/federated/google', passport.authenticate('google', { prompt: 'select_account' }));

// Google Callback
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/welcome'
}));

*/

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { user_id: user.user_id, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// Logout
router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/welcome');
  });
});

module.exports = router;