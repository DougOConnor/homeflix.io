const express = require('express');
const router = express.Router();

const axios = require('axios')
const auth_tokens = require('./auth.json')

const { models } = require('../models');
const sequelize = require('../models');
const Op = require('sequelize').Op;

const {
  formatDate,
  formatTime,
} = require('../utils/helpers')

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
            res.send(data)
        })
    } catch(err) {
        next(err)
    }
});

router.get('/', async (req, res, next) => {
    try {
        const data = await models.showings.findAll({
          where: {
            showing_datetime: {
              [Op.lt]: new Date() + 1
            }
          }
        })        
        data.forEach(item => {
          item.display_date = formatDate(item.showing_datetime)
          item.display_time = formatTime(item.showing_datetime)
          item.movie_json = JSON.parse(item.movie_json)
        })
        res.send( data )
    } catch (err) {
      console.log(err)
      next(err)
    }
  })


router.post('/:id', async (req, res, next) => { 
  try {
    const id = req.params.id;
    await sequelize.query(
      `UPDATE showings 
         SET showing_datetime = :showing_datetime
        WHERE showing_id = :showing_id`,
        {
          replacements: {showing_datetime: req.body.showing_datetime, showing_id: id}
        }
    )
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