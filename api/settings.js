const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()
const fs = require('fs')
const createError = require('http-errors')
const { models } = require('../models');

const getUserIDfromToken = require('../utils/getUserIDfromToken');

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
    let admins = db.prepare('SELECT * from users').all()
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
    const user_id = getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    console.log(user)
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
    const user_id = getUserIDfromToken(req.headers.authorization)
    const user = await models.users.findByPk(user_id)
    if (!user.is_admin) {
      return next(createError.Unauthorized('You are not authorized to do this'))
    } else {
      // Write new layout to file
      let body = req.body
      fs.writeFileSync(theaterLayoutPath, JSON.stringify(body))
      const insert = db.prepare('INSERT INTO seats (seat_id) VALUES (@seatID)');
      body.seating.rows.map((row) => {
        let insertSeats = db.transaction((seats) => {
            for (const seat of seats) insert.run(seat);
        });
        insertSeats(row.seats)
      })
      res.send({})
    }
  } catch(err) {
    next(err)
  }
});

module.exports = router;