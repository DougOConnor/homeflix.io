import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import MovieOverview from '../../components/MovieOverview';

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material'


import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import MoviePoster from '../../components/MoviePoster';

const InputField = {
    width: '100%',
    marginTop: 24
}
const AddMovieScreen = (props) => {
    const navigate = useNavigate()
    const params = useParams()
    const tmdbID = params.id.toString()
    const [movie, setMovie] = useState({})
    const [datetime, setDateTime] = useState()
    const [movieposters, setMoviePosters] = useState({})
    const [showPosterDialog, setShowPosterDialog] = useState()

    useEffect(() => {
        axios.get(
          '/api/v1/tmdb/movie/' + tmdbID
        ).then(response => {
            setMovie(response.data)
        })
        axios.get(
            '/api/v1/tmdb/movie/' + tmdbID + '/images'
        ).then(response => {
            setMoviePosters(response.data)
            console.log(response.data)
        })
      }, [])
    
    const datetimeChangeHandler = (e) => {
        if (e === null) {
            return
        } else {
            setDateTime(e)
        }
    }

    const addShowing = () => {
        const data = {
            "tmdb_id": tmdbID,
            "title": movie.title,
            "poster_path": movie.poster_path,
            "showing_datetime": datetime.format('YYYY-MM-DD HH:mm:SS'),
            "movie_json": movie
        }
        axios.post(
            "/api/v1/showings",
            data
        ).then(() => {
            navigate("/admin/showings")
        })
    }

    const handlePosterDialogOpen = () => setShowPosterDialog(true);
    const handlePosterDialogClose = () => {setShowPosterDialog(false);}
    const updatePoster = (path) => {
        let movieDataString = JSON.stringify(movie)
        let movieData = JSON.parse(movieDataString)
        movieData.poster_path = path
        setMovie(movieData)
    }


    return (
      <Page>
        <Dialog
            open={showPosterDialog}
            onClose={handlePosterDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            Edit Poster
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
          {
            movieposters.posters && movieposters.posters.map((poster) => {
                return (
                    <Grid item xs={6} sm={3} lg={3}>
                      <div
                        style={{cursor: 'pointer'}} 
                        onClick={()=> {updatePoster(poster.file_path); handlePosterDialogClose() } }>
                        <MoviePoster path={poster.file_path} style={{width: "100%"}} />
                      </div>
                    </Grid>
                )
            })
          }
          </Grid>
        </DialogContent>
        </Dialog>
        <div style={{padding: 24}}>
        <Card>
        <CardContent>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={4} md={4} lg={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} >
                <div style={{position: 'relative'}}>
                <IconButton style={{position: 'absolute', top: 5, left: 5, backgroundColor: '#000'}} onClick={()=> handlePosterDialogOpen()}>
                  <EditIcon />
                </IconButton>
                <MoviePoster path={movie.poster_path} style={{width: "100%"}} />
                <img style={{height: 12, marginTop: 12}} src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" />
                </div>
                </Grid>
                <Grid item xs={12} sm={8} md={8} lg={8} >
                <div style={{
                    paddingLeft: 0
                }}>
                    <Typography
                        variant="h5">
                        {movie.title}
                    </Typography>
                    <Typography
                        variant="body2">
                        {movie.tagline}
                    </Typography>
                    <Typography
                        style={{marginTop: 24}}
                        variant="body1">
                        {movie.overview}
                    </Typography>
                    <div style={{marginTop: 24, display: 'flex', flexDirection: 'column'}}>
                    <DateTimePicker
                        id="showing-datetime-picker"
                        ariaLabel='test'
                        className='showing-datetime-picker'
                        label="Showing Datetime"
                        value={datetime}
                        onChange={datetimeChangeHandler}
                        renderInput={(params) => <TextField {...params} />}
                        />
                        <Button id="submit-add-showing" style={{marginTop: 12}} variant="contained" onClick={() => addShowing()}>Add Showing</Button> 
                    </div> 
                </div>
                </Grid>
            </Grid>
            
                   
        </CardContent>
        </Card>
        </div>
      </Page>
    )
}

export default AddMovieScreen