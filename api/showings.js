const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()

const axios = require('axios')
const auth_tokens = require('./auth.json')

const User = require('../models/User')

const user = new User()


router.get('/:id', async (req, res, next) => { 
    try {
        const id = req.params.id;
        let data = db.prepare('SELECT * FROM showings WHERE showing_id = ?').all(id)
        data = data[0]
        let reservations = db.prepare('SELECT seat_id FROM reservations WHERE showing_id = ?').all(id)
        let resList = []
        reservations.map(item => {
            resList.push(item.seat_id)
        })
        data['reservations'] = resList
        axios.get(
            'https://api.themoviedb.org/3/movie/' + data.tmdb_id + '?api_key=' + auth_tokens.tmdb_token + '&language=en-US'
        ).then(response => {
            data['movie'] = response.data
            res.send(data)
        })
    } catch(err) {
        next(err)
    }
});

router.get('/', (req, res, next) => {
    try {
        const data = db.prepare(
            `SELECT * FROM showings WHERE showing_datetime > datetime('now') ORDER BY showing_datetime`
            ).all()
        res.send( data )
    } catch (err) {
      next(err)
    }
  })

router.post('/', async (req, res, next) => { 
  try {
    let body = req.body
    db.prepare(
        `INSERT INTO showings 
                (tmdb_id, title, poster_path, showing_datetime) 
        VALUES (@tmdb_id, @title, @poster_path, @showing_datetime)`).run(body)
        res.send({"status": "success"})
  } catch (err) {
    next(err)
  }
});

module.exports = router;