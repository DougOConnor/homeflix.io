const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()

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


module.exports = router;