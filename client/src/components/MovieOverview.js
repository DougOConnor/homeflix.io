import React from 'react';
import MoviePoster from './MoviePoster';

import {
    Typography
} from '@mui/material'

const MovieOverview = (props) => {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row'
        }}>
            <div>
            <MoviePoster path={props.data.poster_path} style={{width: 200}} />
            <img style={{height: 12, marginTop: 12}} src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" />
            </div>
            <div style={{
                paddingLeft: 24
            }}>
                <Typography
                    variant="h5">
                    {props.data.title}
                </Typography>
                <Typography
                    variant="body2">
                    {props.data.tagline}
                </Typography>
                <Typography
                    style={{marginTop: 24}}
                    variant="body1">
                    {props.data.overview}
                </Typography>
            </div>
        </div>
    )
}

export default MovieOverview