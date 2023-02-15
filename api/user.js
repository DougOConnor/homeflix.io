const express = require('express');
const router = express.Router();

const generateBearerToken = require("../utils/generateBearerToken")
const getUserIDfromToken = require("../utils/getUserIDfromToken")

const { models } = require('../models');
const sequelize = require('../models');

const {
    formatDate,
    formatTime,
} = require('../utils/helpers')

// Get All Users
router.get('/all', async (req, res, next) => {
    try {
        const users_list = await models.users.findAll()
        res.send(users_list)
    } catch (err) {
        next(err)
    }
});


// Insert Reset Password Token
router.post('/reset-password', async (req, res, next) => { 
    try {
        let body = req.body
        let user_id = body.user_id
        let token = generateBearerToken()
        let user = await models.users.findByPk(user_id)
        user.reset_token = token
        user.save()
        res.send({})
    } catch (err) {
        next(err)
    }
});

// Get Current User's Reservations
router.get('/reservations', async (req, res, next) => {
    try {
        
        let user_id = await getUserIDfromToken(req.headers.authorization)
        //let user = await models.users.findByPk(user_id)
        //let reservations = await user.getReservations({ include: models.showings })
        let data = await sequelize.query(
            `
            SELECT
                reservations.user_id,
                reservations.seat_id,
                showings.showing_id,
                showings.title,
                showings.poster_path,
                showings.showing_datetime
            FROM reservations
            LEFT JOIN showings ON reservations.showing_id = showings.showing_id
            WHERE user_id = :user_id
            AND showing_datetime > datetime('now','-1 day','localtime')
            `,
            {
                replacements: { user_id: user_id },
            }
        )
        data[0].forEach(item => {
          item.display_date = formatDate(item.showing_datetime)
          item.display_time = formatTime(item.showing_datetime)
        })
        res.send(data[0])
    } catch (err) {
        next(err)
    }
});

// Create User Account
router.post('/', async (req, res, next) => {  
    try {
        let body = req.body
        let isAdmin = 0
        if (body.is_admin) {
            isAdmin = 1
        } 
        user = await models.users.create({
            username: body.username,
            password: body.password,
            email: body.email,
            is_admin: isAdmin
        })
        let token = generateBearerToken()
        await models.auth_tokens.create({
            user_id: user.user_id,
            token: token
        })
        res.send({
            "status": "success",
            "token": token,
            "user_id": user.user_id,
            "username": user.username,
            "is_admin": isAdmin
        })
    } catch (err) {
        next(err)
    }
});

router.get('/:id', async (req, res) => { 
    res.send({})
});


// Get Current User's Info
router.get('/', async (req, res, next) => {
    try {
        let user_id = await getUserIDfromToken(req.headers.authorization)
        let user = await models.users.findByPk(user_id)
        res.send(user)
    } catch (err) {
        next(err)
    }
});



module.exports = router;
