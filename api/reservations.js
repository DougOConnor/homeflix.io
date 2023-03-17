const express = require('express');
const router = express.Router();

const { models } = require('../models');
const getUserIDfromToken = require("../utils/getUserIDfromToken");
const sequelize = require('../models');

const sendReservationConfirmation = require('./email/email').sendReservationConfirmation

router.post('/', async (req, res, next) => { 
    try {
        let user_id = await getUserIDfromToken(req.headers.authorization)
        let body = req.body
        let reservations = []
        let showing = body.showing_id
        let seats = body.seats

        let distinctSeats = []
        seats.map( seat => {
            reservations.push({showing: showing, user_id: user_id, seat: seat})
        })

        let checkQuery = "SELECT * FROM reservations WHERE showing_id = " + showing.toString() + " AND seat_id in ('" + distinctSeats.join("','") + "')"
        let check = await sequelize.query(checkQuery)

        if (check[0].length > 0) {
            res.send({"error": "Seats already taken", "status": "error"})
        } else {
            
            const insert = 'INSERT INTO reservations (showing_id, user_id, seat_id) VALUES (:showing, :user_id, :seat)';

            const insertReservations = async (reservations) => {
                for (const reservation of reservations) await sequelize.query(insert, { replacements: reservation });
            };
            insertReservations(reservations);
            
            sendReservationConfirmation(showing, user_id)
            res.send( {"status": "success"})
            
        }
    } catch (err) {
        next(err)
    }
    
});

router.get('/', async (req, res, next) => { 
    try {
        let data = await sequelize.query(`
            SELECT
                reservations.seat_id,
                reservations.showing_id,
                reservations.user_id,
                users.username,
                showings.title,
                showings.poster_path,
                showings.showing_datetime
            FROM reservations
            LEFT JOIN users ON reservations.user_id = users.user_id
            LEFT JOIN showings ON reservations.showing_id = showings.showing_id
            WHERE showings.showing_datetime > datetime('now')
        `)
        res.send(data[0])
    } catch (err) {
        next(err)
    }
    
});

router.delete('/:showing_id/:seat_id', async (req, res, next) => { 
    try {
      const showing_id = req.params.showing_id;
      const seat_id = req.params.seat_id;
      const user_id = await getUserIDfromToken(req.headers.authorization)
      const user = await models.users.findByPk(user_id)
      if (user.is_admin) {
        await models.reservations.destroy({where: {
            showing_id: showing_id,
            seat_id: seat_id
          }})
      } else {
        await models.reservations.destroy({where: {
            showing_id: showing_id,
            seat_id: seat_id,
            user_id: user_id
          }})
      }
      res.send({"status": "success"})
    } catch (err) {
      next(err)
    }
  });


module.exports = router;