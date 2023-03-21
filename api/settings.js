const express = require('express');
const router = express.Router();
const fs = require('fs')
const createError = require('http-errors')
const { models } = require('../models');

const getUserIDfromToken = require('../utils/getUserIDfromToken');
const sequelize = require('../models');

const theaterLayoutPath = './data/layout.json'
const theaterInfoPath = './data/info.json'
const emailConfigPath = './data/email.json'

const sendEmail = require('./email/email').sendEmail;
const renderTemplate = require('./email/email').renderTemplate;

const { config } = require('process');


router.get('/app-info', async (req, res, next) => {
  try {
    let response = {
      loaded: true
    }
    // Check if theater layout file exist
    if (fs.existsSync(theaterLayoutPath)) { 
        response.hasLayout = true
    } else {
        response.hasLayout = false
    }

    // Check if theater info file exist
    if (fs.existsSync(theaterInfoPath)) { 
        response.hasInfo = true
    } else {
        response.hasInfo = false
    }

    // Check if any admin users exist
    let admins = await models.users.findAll({ where: {is_admin: true} })
    if (admins.length > 0) {
        response.hasAdmin = true
    } else {
        response.hasAdmin = false
    }

    res.send(response)
  } catch (err) {
    next(err)
  }
    
});

router.get('/info', async (req, res, next) => {
  let data = {}
  try {
    if (fs.existsSync(theaterInfoPath)) {
      data = fs.readFileSync(theaterInfoPath)
      res.send(data)
    } else {
      res.send({})
    }
  } catch (err) {
    next(err)
  }
});

router.post('/info', async (req, res, next) => { 
  try {
    // Check if user is admin
    const user_id = await getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    if (!user.is_admin) {
      return next(createError.Unauthorized('You are not authorized to do this'))
    } else {
      // Write new info to file
      let body = req.body
      fs.writeFileSync(theaterInfoPath, JSON.stringify(body))
      res.send({})
    }
  } catch(err) {
    next(err)
  }
    
    
});

router.get('/layout', async (req, res, next) => { 
  try {
    let data = {}
    if (fs.existsSync(theaterLayoutPath)) {
      data = fs.readFileSync(theaterLayoutPath)
    }
    res.send(data)
  } catch (err) {
    next(err)
  }
});

router.post('/layout', async (req, res, next) => { 
  try {
    // Check if user is admin
    const user_id = await getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    if (!user.is_admin) {
      return next(createError.Unauthorized('You are not authorized to do this'))
    } else {
      // Write new layout to file
      let body = req.body
      fs.writeFileSync(theaterLayoutPath, JSON.stringify(body))
      body.seating.rows.map((row) => {
        row.seats.map(async (seat) => {
          console.log(seat)
          await models.seats.create({seat_id: seat.seatID});
        })
      })
      res.send({})
    }
  } catch(err) {
    next(err)
  }
});

router.post('/email', async (req, res, next) => {
  try {
    // Check if user is admin
    const user_id = await getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    if (!user.is_admin) {
      return next(createError.Unauthorized('You are not authorized to do this'))
    } else {
      // Write new layout to file
      let body = req.body
      fs.writeFileSync(emailConfigPath, JSON.stringify(body))
      res.send({})
    }
  } catch(err) {
    next(err)
  }
});

router.get('/email', async (req, res, next) => { 
  try {
    
    let is_admin = false
    console.log(req.headers)
    if (req.headers.authorization === undefined) {
      is_admin = false
    } else {
      const user_id = await getUserIDfromToken(req.headers.authorization)
      const user = await models.users.findByPk(user_id)
      is_admin = user.is_admin
    }
    
    let data = {}
    let response = {}
    if (fs.existsSync(emailConfigPath)) {
      console.log('file exists')
      data = JSON.parse(fs.readFileSync(emailConfigPath))
      if (is_admin) {
        response = data
      } else {
        response = {
          smtp_enabled: data.smtp_enabled
        }
      }
    }
    console.log(response)
    res.send(response)
  } catch (err) {
    console.log(err)
    next(err)
  }
});

router.post('/test-email', async (req, res, next) => { 
  try {
    // Check if user is admin
    const user_id = await getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    if (!user.is_admin) {
      return next(createError.Unauthorized('You are not authorized to do this'))
    } else {
      // Write new layout to file
      let body = req.body
      let html = await renderTemplate("test_email.html", {"email": body.smtp_test_recepient})
      console.log(html)
      let response = await sendEmail(body.smtp_test_recepient, "Test Email", html, "Test Email", body)
      res.send(response)
    }
  } catch(err) {
    next(err)
  }
});

module.exports = router;