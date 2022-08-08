const express = require('express');
const router = express.Router();
const getDatabase = require('../utils/getDatabase')
const db = getDatabase()
const axios = require('axios')
const auth_tokens = require('./auth.json')

router.get('/movie/:id', async (req, res) => { 
    const id = req.params.id;
    try {
        axios.get(
            'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + auth_tokens.tmdb_token + '&language=en-US'
          ).then(response => {
              res.send(response.data)
          })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});

router.get('/search', async (req, res) => { 
    const search = req.query.q
    try {
        axios.get(
            'http://api.themoviedb.org/3/search/movie?api_key=' + auth_tokens.tmdb_token + '&language=en-US&page=1&include_adult=false&query=' + search
        ).then(data => {
            res.send(data.data)
        })
    } catch (err) {
        res.send(err)
    }
});

router.get('/trending/movie', async (req, res) => { 
    const search = req.query.q
    try {
        axios.get(
            'https://api.themoviedb.org/3/trending/movie/week?api_key=' + auth_tokens.tmdb_token
        ).then(data => {
            res.send(data.data)
        })
    } catch (err) {
        res.send(err)
    }
});


module.exports = router;