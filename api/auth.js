const express = require('express');
const router = express.Router();
const createError = require('http-errors')

const generateBearerToken = require("../utils/generateBearerToken")

const { models } = require("../models")
const { Op } = require("sequelize");

// Login
router.post('/login', async (req, res, next) => { 
    try {
        let body = req.body
        let user = await models.users.findOne({
            "where": {
              "password": body.password,
              [Op.or]: [
                { username: body.username },
                { email: body.username}
              ]
            }
        })
        if (user != null) {
            let token = generateBearerToken()
            let payload = {
              token: token,
              username: user.username,
              email: user.email,
              user_id: user.user_id,
              is_admin: user.is_admin
            }
            await models.auth_tokens.create({user_id: user.user_id, token:token})
            res.send(payload)
        } else {
            return next(createError.Unauthorized('No account found with those credentials'))
        }
    } catch (err) {
        next(err)
    }
});

router.post('/reset-password', async (req, res, next) => { 
    try {
        let body = req.body
        let user = await models.users.findOne({
          "where": {
            "reset_token": body.reset_token
          }
        })
        
        if (user.reset_token == body.reset_token) {
            let token = generateBearerToken()
            let payload = {
              token: token,
              username: user.username,
              email: user.email,
              user_id: user.user_id,
              is_admin: user.is_admin
            }
            user.password = body.password
            user.reset_token = null
            await user.save()
            await models.auth_tokens.create({user_id: user.user_id, token: token})
            res.send(payload)
        } else {
            res.sendStatus(401)
        }
    } catch (err) {
        next(err)
    }
});



module.exports = router;