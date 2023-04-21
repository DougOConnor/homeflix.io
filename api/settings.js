const express = require('express');
const router = express.Router();
const fs = require('fs')
const createError = require('http-errors')
const { models } = require('../models');
const { zipSettings, readSettings, writeSettings } = require('./utils/helpers');

const getUserIDfromToken = require('../utils/getUserIDfromToken');
const sequelize = require('../models');
const { Op } = require('sequelize');

const emailConfigPath = './data/email.json'

const sendEmail = require('./email/email').sendEmail;
const renderTemplate = require('./email/email').renderTemplate;

const smtp_settings = [
  "smtp_enabled",
  "smtp_server",
  "smtp_username",
  "smtp_password",
  "smtp_port",
  "smtp_tls",
  "smtp_from_email",
  "smtp_from_name",
  "smtp_test_recipient"
]


router.get('/app-info', async (req, res, next) => {
  try {
    let response = {
      loaded: true
    }

    hasLayout = await models.settings.findOne({ where: {key: 'first_time_layout_complete'}, raw: true })
    response.hasLayout = hasLayout.value === 'true' ? true : false
    
    hasInfo = await models.settings.findOne({ where: {key: 'first_time_settings_complete'}, raw: true })
    response.hasInfo = hasInfo.value === 'true' ? true : false

    hasAdmin = await models.users.findAll({ where: {is_admin: true}, raw: true })
    response.hasAdmin = hasAdmin.length > 0 ? true : false

    res.send(response)
  } catch (err) {
    console.log(err)
    next(err)
  }
    
});

router.get('/info', async (req, res, next) => {
  try {
    let data = await sequelize.models.settings.findAll({where: { key: { [Op.in]: ['theater_name']} }})
    data = JSON.parse(JSON.stringify(data))
    res.send(zipSettings(data))
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
      Object.keys(req.body).forEach(async (key) => {
        await models.settings.update({value: req.body[key]}, {where: {key: key}})
      })
      res.send({})
    }
  } catch(err) {
    next(err)
  }
    
    
});

router.get('/layout', async (req, res, next) => { 
  try {
    let data = await models.settings.findByPk('theater_layout')
    data = JSON.parse(JSON.stringify(data))
    res.send(JSON.parse(data.value))
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
      await models.settings.update({value: JSON.stringify(body)}, {where: {key: 'theater_layout'}})
      await models.settings.update({value: "true"}, {where: {key: 'first_time_layout_complete'} } )
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
      await writeSettings(body)
      res.send({})
    }
  } catch(err) {
    next(err)
  }
});

router.get('/email', async (req, res, next) => { 
  try {
    
    let is_admin = false
    if (req.headers.authorization === undefined) {
      is_admin = false
    } else {
      const user_id = await getUserIDfromToken(req.headers.authorization)
      const user = await models.users.findByPk(user_id)
      is_admin = user.is_admin
    }
    let data = await readSettings(smtp_settings)
    res.send(data)
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
      let body = req.body
      let html = await renderTemplate("test_email.html", {"email": body.smtp_test_recipient}) 
      let response = await sendEmail(body.smtp_test_recipient, "Test Email", html, "Test Email", body)
      res.send(response)
    }
  } catch(err) {
    next(err)
  }
});

module.exports = router;