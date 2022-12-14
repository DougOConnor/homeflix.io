const express = require('express');
const router = express.Router();
const fs = require('fs')
const createError = require('http-errors')
const { models } = require('../models');

const getUserIDfromToken = require('../utils/getUserIDfromToken');
const sequelize = require('../models');

const theaterLayoutPath = './data/layout.json'
const theaterInfoPath = './data/info.json'


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

module.exports = router;