import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import Page from '../../components/Page'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { CardMedia } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MoviePoster from '../../components/MoviePoster';

const resultCardStyle = {
    marginTop: 12,
    flexDirection: 'row',
    display: 'flex'
}

const AddMovieScreen = (props) => {
    const navigate = useNavigate()
    const emptyReults = {results: []}
    const [results, setResults] = useState(emptyReults)

    const searchChangeHandler = (e) => {
        let q = e.target.value
        let dontSend = [undefined, '']
        let check = dontSend.indexOf(q)
        if (check === -1) {
            axios.get(
                "/api/v1/tmdb/search?q=" + e.target.value
            ).then(results => setResults(results.data))
        } else {
            setResults(emptyReults)
        }
        
    }

    return (
      <Page>
        <div style={{padding: 24}}>
        <Card>
        <CardContent>
            <Typography color="text.primary" >
            Add a showing
            </Typography>
            <TextField
                id="search-movie"
                style={{
                    width: '100%',
                    marginTop: 8
                }}
                //label="Search"
                variant="standard"
                onChange={(e) => searchChangeHandler(e)}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
            <img style={{height: 12, marginTop: 12}} src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" />
        </CardContent>
        </Card>
        {
            results.results.map(results => {
                return(
                    <Card style={resultCardStyle} key={results.id}>
                    <MoviePoster
                        style={{width: "40%"}}
                        path={results.poster_path}
                    />
                        <div>
                        <CardContent >
                            <Typography variant='h5' color="text.primary" >
                            {results.original_title}
                            </Typography>
                            <p>{results.release_date}</p>
                            </CardContent>
                            <CardActions>
                                <Button id={"add-showing-" + results.id.toString()} size="small" variant="contained" onClick={() => navigate("/add-showing/" + results.id.toString())}>Add Showing</Button>
                            </CardActions>
                        </div>
                    </Card>
                )
            })
        }
        </div>
      </Page>
    )
}

export default AddMovieScreen