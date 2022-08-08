const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()

const generateBearerToken = require("../utils/generateBearerToken")
const getUserIDfromToken = require("../utils/getUserIDfromToken")

const User = require("../models/User")
const user = new User()


// Get All Users
router.get('/all', async (req, res, next) => {
    try {
        const data = db.prepare(
            `
            SELECT * FROM users
            `
        ).all()
        res.send(data)
    } catch (err) {
        next(err)
    }
});


// Insert Reset Password Token
router.post('/reset-password', async (req, res, next) => { 
    try {
        console.log(req.body)
        let body = req.body
        let user_id = body.user_id
        let token = generateBearerToken()
        let query = `
            UPDATE users
            SET reset_token = @token
            WHERE user_id = @user_id
        `
        db.prepare(query).run({user_id: user_id, token: token})
        res.send({})
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
        let user_id = db.prepare(
            `INSERT INTO users 
            (username, password, is_admin)
            VALUES (@username, @password, @is_admin)
            returning user_id
            `).run({username: body.username, password: body.password, is_admin: isAdmin})
        let token = generateBearerToken()
        db.prepare(
            `
            INSERT INTO user_auth_tokens
            (user_id, token)
            VALUES
            (@user_id, @token)
            `
        ).run({user_id: user_id.lastInsertRowid, token: token})
        res.send({
            "status": "success",
            "token": token,
            "user_id": user_id.lastInsertRowid,
            "username": body.username,
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
        let user_id = getUserIDfromToken(req.headers.authorization)
        let data = user.getUserFromID(user_id)
        res.send(data)
    } catch (err) {
        next(err)
    }
});

module.exports = router;
