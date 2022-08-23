const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()

const createError = require('http-errors')
const User = require('../models/User')
const user = new User()

const getUserIDfromToken = require("../utils/getUserIDfromToken")

router.post('/', async (req, res, next) => { 
    try {
        let user_id = getUserIDfromToken(req.headers.authorization)
        let body = req.body
        let reservations = []
        let showing = body.showing_id
        let seats = body.seats

        console.log(seats)

        let distinctSeats = []
        seats.map( seat => {
            reservations.push({showing: showing, user_id: user_id, seat: seat})
        })

        let checkQuery = "SELECT * FROM reservations WHERE showing_id = " + showing.toString() + " AND seat_id in ('" + distinctSeats.join("','") + "')"
        let check = await db.prepare(checkQuery).all()

        if (check.length > 0) {
            res.send({"error": "Seats already taken", "status": "error"})
        } else {
            
            const insert = db.prepare('INSERT INTO reservations (showing_id, user_id, seat_id) VALUES (@showing, @user_id, @seat)');
            const insertReservations = db.transaction((reservations) => {
                for (const reservation of reservations) insert.run(reservation);
            });
            insertReservations(reservations);
            res.send( {"status": "success"})
        }
    } catch (err) {
        next(err)
    }
    
});

router.get('/', async (req, res, next) => { 
    try {
        let data = await db.prepare(`
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
        `).all()
        res.send(data)
    } catch (err) {
        next(err)
    }
    
});

router.delete('/:showing_id/:seat_id', async (req, res, next) => { 
    try {
      const showing_id = req.params.showing_id;
      const seat_id = req.params.seat_id;
      const user_id = getUserIDfromToken(req.headers.authorization)
      if (user.isAdmin(user_id)) {
        db.prepare(
            'DELETE FROM reservations WHERE showing_id = @showing_id AND seat_id = @seat_id'
        ).run({"seat_id": seat_id, "showing_id": showing_id})
      } else {
        db.prepare(
            'DELETE FROM reservations WHERE showing_id = @showing_id AND seat_id = @seat_id AND user_id = @user_id'
        ).run({"seat_id": seat_id, "showing_id": showing_id, "user_id": user_id})
      }
      res.send({"status": "success"})
    } catch (err) {
      next(err)
    }
  });


module.exports = router;