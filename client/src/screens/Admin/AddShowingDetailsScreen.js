import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import MovieOverview from '../../components/MovieOverview';

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardMedia } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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

    useEffect(() => {
        axios.get(
          '/api/v1/tmdb/movie/' + tmdbID
        ).then(response => {
            setMovie(response.data)
        })
      }, [])
    
    const datetimeChangeHandler = (e) => {
        console.log(e.format('MM-DD-YYYY HH:mm:SS'))
        setDateTime(e)
    }

    const addShowing = () => {
        const data = {
            "tmdb_id": tmdbID,
            "title": movie.title,
            "poster_path": movie.poster_path,
            "showing_datetime": datetime.format('YYYY-MM-DD HH:mm:SS')
        }
        axios.post(
            "/api/v1/showings",
            data
        ).then(() => {
            navigate("/")
        })
    }


    return (
      <Page>
        <div style={{padding: 24}}>
        <Card>
        <CardContent>
            <div style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                <div>
                <MoviePoster path={movie.poster_path} style={{width: 200}} />
                <img style={{height: 12, marginTop: 12}} src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" />
                </div>
                <div style={{
                    paddingLeft: 24
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
                        label="Showing Datetime"
                        value={datetime}
                        onChange={datetimeChangeHandler}
                        renderInput={(params) => <TextField {...params} />}
                        />
                        <Button style={{marginTop: 12}} variant="contained" onClick={() => addShowing()}>Add Showing</Button> 
                    </div> 
                </div>
            </div>
            
                   
        </CardContent>
        </Card>
        </div>
      </Page>
    )
}

export default AddMovieScreen