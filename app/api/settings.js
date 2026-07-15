const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const { models } = require('../models');
const { zipSettings, readSettings, writeSettings } = require('./utils/helpers');

const getUserIDfromToken = require('../utils/getUserIDfromToken');
const { requireAdmin } = require('./utils/auth');
const sequelize = require('../models');
const { Op } = require('sequelize');


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
  "smtp_test_recipient",
  "app_url"
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

    const adminCount = await models.user.count({ where: {is_admin: true} })
    response.hasAdmin = adminCount > 0

    res.send(response)
  } catch (err) {
    console.log(err)
    next(err)
  }
    
});

router.get('/info', async (req, res, next) => {
  try {
    let data = await sequelize.models.settings.findAll({where: { key: { [Op.in]: ['theater_name', 'theater_icon']} }})
    data = JSON.parse(JSON.stringify(data))
    res.send(zipSettings(data))
  } catch (err) {
    next(err)
  }
});

router.post('/info', async (req, res, next) => { 
  try {
    // Check if user is admin

      // Upsert so new settings keys (e.g. theater_icon) get created
      for (const key of Object.keys(req.body)) {
        await models.settings.upsert({key: key, value: req.body[key]})
      }
      res.send({})

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
    
  } catch(err) {
    next(err)
  }
});

router.post('/email', requireAdmin, async (req, res, next) => {
  try {
    await writeSettings(req.body)
    res.send({})
  } catch(err) {
    next(err)
  }
});

router.get('/email', requireAdmin, async (req, res, next) => {
  try {
    let data = await readSettings(smtp_settings)
    res.send(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
});

router.post('/test-email', requireAdmin, async (req, res, next) => {
  try {
    let body = req.body
    let html = await renderTemplate("test_email.html", {"email": body.smtp_test_recipient})
    let response = await sendEmail(body.smtp_test_recipient, "Test Email", html, "Test Email", body)
    res.send(response)
  } catch(err) {
    // Surface SMTP failures to the admin instead of a generic 500
    res.status(502).send({error: err.message})
  }
});

module.exports = router;