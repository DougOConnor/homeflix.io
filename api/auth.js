const express = require('express');
const router = express.Router();
const createError = require('http-errors')

const generateBearerToken = require("../utils/generateBearerToken")

const { models } = require("../models")
const { Op } = require("sequelize");
const { generateEncryptedPassword, validateEncryptedPassword } = require('./utils/encrypt')


// Login
router.post('/login', async (req, res, next) => { 
    try {
        let body = req.body
        let user = await models.users.findOne({
            "where": {
              [Op.or]: [
                { username: body.username },
                { email: body.username}
              ]
            }
        })
        if (user != null) {
          if (validateEncryptedPassword(body.password, user.password)) {
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
            return next(createError.Unauthorized('Incorrect password'))
          }
            
        } else {
            return next(createError.Unauthorized('No account found with that username or email'))
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
            user.password = await generateEncryptedPassword(body.password)
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