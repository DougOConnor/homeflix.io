const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()
const fs = require('fs')

const User = require('../models/User')
const user = new User()

const getUserIDfromToken = require('../utils/getUserIDfromToken')


const theaterLayoutPath = './data/layout.json'
const theaterInfoPath = './data/info.json'


router.get('/app-info', async (req, res) => { 
    let response = {
        loaded: true
    }
    if (fs.existsSync(theaterLayoutPath)) { 
        response.hasLayout = true
    } else {
        response.hasLayout = false
    }

    if (fs.existsSync(theaterInfoPath)) { 
        response.hasInfo = true
    } else {
        response.hasInfo = false
    }

    let admins = db.prepare('SELECT * from users').all()
    if (admins.length > 0) {
        response.hasAdmin = true
    } else {
        response.hasAdmin = false
    }

    res.send(response)
});

router.get('/info', async (req, res) => {
    let data = {}
    if (fs.existsSync(theaterInfoPath)) {
        data = fs.readFileSync(theaterInfoPath)
    }
    try {
        res.send(data)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.post('/info', async (req, res) => { 
    const user_id = getUserIDfromToken(req.headers.authorization)
    if (user.isAdmin(user_id)) {
        let body = req.body
        try {
            fs.writeFileSync(theaterInfoPath, JSON.stringify(body))
            res.send({})
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.sendStatus(401)
    }
    
});

router.get('/layout', async (req, res) => { 
    let data = {}
    if (fs.existsSync(theaterLayoutPath)) {
        data = fs.readFileSync(theaterLayoutPath)
    }
    try {
        res.send(data)
    } catch (err) {
        res.status(500).send(err)
    }
});

router.post('/layout', async (req, res) => { 
    const user_id = getUserIDfromToken(req.headers.authorization)
    if (user.isAdmin(user_id)) {
        let body = req.body
        try {
            fs.writeFileSync(theaterLayoutPath, JSON.stringify(body))
            const insert = db.prepare('INSERT INTO seats (seat_id) VALUES (@seatID)');
            body.seating.rows.map((row) => {
                let insertSeats = db.transaction((seats) => {
                    for (const seat of seats) insert.run(seat);
                });
                insertSeats(row.seats)
            })
            res.send({})
        } catch (err) {
            console.error(err)
            res.status(500).send(err)
        }
    } else {
        res.sendStatus(401)
    }
});

module.exports = router;