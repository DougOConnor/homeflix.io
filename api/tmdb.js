const express = require('express');
const router = express.Router();
const axiosRetry = require('axios-retry');
const axios = require('axios')
const auth_tokens = require('./auth.json')

axiosRetry(axios, { retries: 3 });

router.get('/movie/:id', async (req, res, next) => {  
    try {
        const id = req.params.id;
        axios.get(
            'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + auth_tokens.tmdb_token + '&language=en-US'
          ).then(response => {
              res.send(response.data)
          }).catch(err => {
              next(err)
          })
    } catch (err) {
        next(err)
    }
});

router.get('/search', async (req, res, next) => { 
    try {
        const search = req.query.q
        axios.get(
            'http://api.themoviedb.org/3/search/movie?api_key=' + auth_tokens.tmdb_token + '&language=en-US&page=1&include_adult=false&query=' + search
        ).then(data => {
            res.send(data.data)
        }).catch(err => {
            next(err)
        })
    } catch (err) {
        next(err)
    }
});

router.get('/trending/movie', async (req, res, next) => { 
    try {
        const search = req.query.q
        axios.get(
            'https://api.themoviedb.org/3/trending/movie/week?api_key=' + auth_tokens.tmdb_token
        ).then(data => {
            res.send(data.data)
        }).catch(err => {
            next(err)
        })
    } catch (err) {
        next(err)
    }
});


module.exports = router;