const express = require('express');
const router = express.Router();

const { models } = require('../models');
const { requireUser, requireAdmin } = require("./utils/auth");
const sequelize = require('../models');
const Op = require('sequelize').Op;

const sendReservationConfirmation = require('./email/email').sendReservationConfirmation

router.post('/', requireUser, async (req, res, next) => {
    try {
        let user_id = req.actingUser.user_id
        let body = req.body
        let reservations = []
        let showing = body.showing_id
        let seats = body.seats

        seats.map( seat => {
            reservations.push({showing_id: showing, user_id: user_id, seat_id: seat})
        })

        let check = await sequelize.models.reservations.count({
            where: {
                showing_id: showing,
                seat_id: {
                    [Op.in]: seats
                }
            }
        })

        if (check > 0) {
            res.send({"error": "Seats already taken", "status": "error"})
        } else {
            await sequelize.models.reservations.bulkCreate(reservations)
            sendReservationConfirmation(showing, user_id).catch(err => console.log("confirmation email failed:", err.message))
            res.send( {"status": "success"})
        }
    } catch (err) {
        next(err)
    }

});

// Bookings for the logged-in user, grouped by showing (one entry per ticket)
router.get('/mine', requireUser, async (req, res, next) => {
    try {
        const user_id = req.actingUser.user_id
        const email = req.actingUser.email

        const rows = await sequelize.models.reservations.findAll({
            where: { user_id: user_id },
            include: [sequelize.models.showings]
        })

        const grouped = {}
        rows.forEach(row => {
            const showing = row.showing
            if (!showing) return
            if (!grouped[row.showing_id]) {
                let movieJson = {}
                try {
                    movieJson = JSON.parse(showing.movie_json) || {}
                } catch (e) {}
                grouped[row.showing_id] = {
                    showing_id: row.showing_id,
                    title: showing.title,
                    poster_path: showing.poster_path,
                    backdrop_path: movieJson.backdrop_path || null,
                    showing_datetime: showing.showing_datetime,
                    email: email,
                    seats: [],
                    snacks: []
                }
            }
            grouped[row.showing_id].seats.push(row.seat_id)
        })

        // Attach any snack orders for those showings
        const orders = await sequelize.models.snack_orders.findAll({ where: { user_id: user_id } })
        orders.forEach(order => {
            const group = grouped[order.showing_id]
            if (!group) return
            let items = []
            try {
                items = JSON.parse(order.items) || []
            } catch (e) {}
            group.snacks = group.snacks.concat(items)
        })

        const tickets = Object.values(grouped)
        tickets.forEach(t => t.seats.sort())
        tickets.sort((a, b) => (a.showing_datetime < b.showing_datetime ? 1 : -1))
        res.send(tickets)
    } catch (err) {
        next(err)
    }
});

// Check-in status for a showing (admin — used by the ticket scanner)
router.get('/check-in/:showing_id', requireAdmin, async (req, res, next) => {
    try {
        const rows = await models.reservations.findAll({
            where: { showing_id: req.params.showing_id },
            include: [sequelize.models.user]
        })
        res.send(rows.map(row => ({
            seat_id: row.seat_id,
            checked_in: row.checked_in === true || row.checked_in === 1,
            checked_in_at: row.checked_in_at,
            email: row.user ? row.user.email : null,
        })))
    } catch (err) {
        next(err)
    }
});

// Mark seats as checked in (admin — used by the ticket scanner)
router.post('/check-in', requireAdmin, async (req, res, next) => {
    try {
        const { showing_id, seats } = req.body
        if (!showing_id || !Array.isArray(seats)) {
            return res.status(400).send({ error: 'showing_id and seats are required' })
        }
        const rows = await models.reservations.findAll({
            where: { showing_id: showing_id, seat_id: { [Op.in]: seats } }
        })
        const found = {}
        rows.forEach(row => { found[row.seat_id] = row })

        const results = {}
        const now = new Date().toISOString()
        for (const seat of seats) {
            const row = found[seat]
            if (!row) {
                results[seat] = { status: 'no_reservation' }
            } else if (row.checked_in) {
                results[seat] = { status: 'already_checked_in', checked_in_at: row.checked_in_at }
            } else {
                await row.update({ checked_in: true, checked_in_at: now })
                results[seat] = { status: 'checked_in', checked_in_at: now }
            }
        }
        res.send({ results })
    } catch (err) {
        next(err)
    }
});

router.get('/', requireAdmin, async (req, res, next) => {
    try {
        let data = await sequelize.models.reservations.findAll({
            include: [
                sequelize.models.showings,
                sequelize.models.user,
            ]
        })
        res.send(data)
    } catch (err) {
        console.log(err)
        next(err)
    }

});

router.delete('/:showing_id/:seat_id', requireUser, async (req, res, next) => {
    try {
      const showing_id = req.params.showing_id;
      const seat_id = req.params.seat_id;
      const user = req.actingUser
      if (user.is_admin === true || user.is_admin === 1) {
        await models.reservations.destroy({where: {
            showing_id: showing_id,
            seat_id: seat_id
          }})
      } else {
        await models.reservations.destroy({where: {
            showing_id: showing_id,
            seat_id: seat_id,
            user_id: user.user_id
          }})
      }
      res.send({"status": "success"})
    } catch (err) {
      next(err)
    }
  });


module.exports = router;
