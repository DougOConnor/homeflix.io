const express = require('express');
const router = express.Router();

const generateBearerToken = require("../utils/generateBearerToken")
const getUserIDfromToken = require("../utils/getUserIDfromToken")
const { generateEncryptedPassword, validateEncryptedPassword } = require('./utils/encrypt')

const { models } = require('../models');
const sequelize = require('../models');
const  Op  = require("sequelize").Op;

const {
    formatDate,
    formatTime,
} = require('../utils/helpers')

const {
    sendPasswordReset
} = require('./email/email')

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
        console.log(req.get("host"))
        let body = req.body
        let user_id = body.user_id
        let username = body.username
        let user = null
        if (username) {
            user = await models.users.findOne({ where : { [Op.or] : [
                    { username: username },
                    { email: username}
                ]}})
            user_id = user.user_id
        } else {
            user = await models.users.findByPk(user_id)
        }   
        let token = generateBearerToken()
        user.reset_token = token
        user.save()
        sendPasswordReset(user.email, req.get("host"), token)
        res.send({})
    } catch (err) {
        console.log(err)
        next(err)
    }
});

// Get Current User's Reservations
router.get('/reservations', async (req, res, next) => {
    try {
        let user_id = await getUserIDfromToken(req.headers.authorization)
        let data = await sequelize.models.showings.findAll({
            attributes: ['showing_id', 'showing_datetime', 'title', 'poster_path', 'tmdb_id'],
            where: {
                showing_datetime: {
                    [Op.lt]: new Date() + 1
                },
            },
            include: {
                model: sequelize.models.reservations,
                attributes: ['seat_id'],
                where: {
                    user_id: user_id,
                }
            }
        })
        data = JSON.parse(JSON.stringify(data))
        data.forEach(item => {
          item.display_date = formatDate(item.showing_datetime)
          item.display_time = formatTime(item.showing_datetime)
        })
        res.send(data)
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
        let encyptedPassword = await generateEncryptedPassword(body.password)
        user = await models.users.create({
            username: body.username,
            password: encyptedPassword,
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
        console.log(err)
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
