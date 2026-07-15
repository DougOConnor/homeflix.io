const express = require('express');
const router = express.Router();

const axios = require('axios')
const auth_tokens = { tmdb_token: require('../utils/tmdbToken') }

const { models } = require('../models');
const sequelize = require('../models');
const Op = require('sequelize').Op;

const {
  formatDate,
  formatTime,
} = require('../utils/helpers')

const { readSettings } = require('./utils/helpers')

// "2026-07-14T18:30" — matches the stored showing_datetime format so
// lexicographic comparison works chronologically.
const localISO = (date) => {
  const pad = (n) => n.toString().padStart(2, '0')
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) + ':' + pad(date.getMinutes())
}

const countLayoutSeats = async () => {
  try {
    const settings = await readSettings(['theater_layout'])
    const layout = settings.theater_layout
    if (!layout || !layout.seating) return null
    return layout.seating.rows.reduce((total, row) => total + row.seats.length, 0)
  } catch (e) {
    return null
  }
}

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        let showing = await models.showings.findByPk(id)
        data = {
          "showing_id": showing.showing_id,
          "title": showing.title,
          "poster_path": showing.poster_path,
          "showing_datetime": showing.showing_datetime,
          "tmdb_id": showing.tmdb_id
        }
        let storedMovie = {}
        try {
            storedMovie = JSON.parse(showing.movie_json) || {}
        } catch (e) {}
        let reservations = await models.reservations.findAll({ where: { showing_id: id } })
        let resList = []
        reservations.map(item => {
            resList.push(item.seat_id)
        })
        data['reservations'] = resList
        axios.get(
            'https://api.themoviedb.org/3/movie/' + data.tmdb_id + '?api_key=' + auth_tokens.tmdb_token + '&language=en-US'
        ).then(response => {
            data['movie'] = response.data
            // Admin-selected artwork overrides the default TMDB images
            if (showing.poster_path) {
                data.movie.poster_path = showing.poster_path
            }
            if (storedMovie.backdrop_path) {
                data.movie.backdrop_path = storedMovie.backdrop_path
            }
            res.send(data)
        })
    } catch(err) {
        next(err)
    }
});

router.get('/', async (req, res, next) => {
    try {
        let where = {}
        if (req.query.all !== '1') {
          // Guests only see upcoming showings, with a grace window so a
          // movie doesn't vanish the minute it starts.
          const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000)
          where.showing_datetime = { [Op.gte]: localISO(cutoff) }
        }
        const data = await models.showings.findAll({
          where: where,
          order: [['showing_datetime', 'ASC']]
        })

        const seatsTotal = await countLayoutSeats()
        const counts = await models.reservations.findAll({
          attributes: ['showing_id', [sequelize.fn('COUNT', sequelize.col('seat_id')), 'reserved']],
          group: ['showing_id'],
          raw: true,
        })
        const reservedByShowing = {}
        counts.forEach(row => { reservedByShowing[row.showing_id] = parseInt(row.reserved) })

        const payload = data.map(item => {
          const record = item.toJSON()
          record.display_date = formatDate(record.showing_datetime)
          record.display_time = formatTime(record.showing_datetime)
          try {
            record.movie_json = JSON.parse(record.movie_json)
          } catch (e) {
            record.movie_json = null
          }
          record.seats_reserved = reservedByShowing[record.showing_id] || 0
          record.seats_total = seatsTotal
          return record
        })
        res.send(payload)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })


router.post('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const showing = await models.showings.findByPk(id)
    if (!showing) {
      return res.status(404).send({"status": "not found"})
    }
    const updates = {}
    if (req.body.showing_datetime) {
      updates.showing_datetime = req.body.showing_datetime
    }
    if (req.body.poster_path) {
      updates.poster_path = req.body.poster_path
    }
    if (req.body.poster_path || req.body.backdrop_path) {
      let movieJson = {}
      try {
        movieJson = JSON.parse(showing.movie_json) || {}
      } catch (e) {}
      if (req.body.poster_path) {
        movieJson.poster_path = req.body.poster_path
      }
      if (req.body.backdrop_path) {
        movieJson.backdrop_path = req.body.backdrop_path
      }
      updates.movie_json = JSON.stringify(movieJson)
    }
    await showing.update(updates)
    res.send({"status": "success"})
  } catch (err) {
    next(err)
  }
});
  
router.post('/', async (req, res, next) => { 
  try {
    let body = req.body
    console.log(body)
    console.log(JSON.stringify(body.movie_json))
    let showing = await models.showings.create({
      title: body.title,
      poster_path: body.poster_path,
      tmdb_id: body.tmdb_id,
      showing_datetime: body.showing_datetime,
      movie_json: JSON.stringify(body.movie_json)
    })
    res.send({"status": "success"})
  } catch (err) {
    console.log(err)
    next(err)
  }
});

router.delete('/:id', async (req, res, next) => { 
  try {
    const id = req.params.id;
    await sequelize.models.reservations.destroy({ where: { showing_id: id } })
    await sequelize.models.showings.destroy({ where: { showing_id: id } })
    res.send({"status": "success"})
  } catch (err) {
    next(err)
  }
});

module.exports = router;