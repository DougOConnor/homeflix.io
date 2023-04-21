const express = require('express');
const router = express.Router();

const { models } = require('../models');
const getUserIDfromToken = require("../utils/getUserIDfromToken");
const sequelize = require('../models');
const Op = require('sequelize').Op;

const sendReservationConfirmation = require('./email/email').sendReservationConfirmation

router.post('/', async (req, res, next) => { 
    try {
        let user_id = await getUserIDfromToken(req.headers.authorization)
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
            sequelize.models.reservations.bulkCreate(reservations)
            sendReservationConfirmation(showing, user_id)
            res.send( {"status": "success"})
        }
    } catch (err) {
        next(err)
    }
    
});

router.get('/', async (req, res, next) => { 
    try {
        let data = await sequelize.models.reservations.findAll({
            include: [
                sequelize.models.showings,
                sequelize.models.users,
            ]
        })
        res.send(data)
    } catch (err) {
        console.log(err)
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