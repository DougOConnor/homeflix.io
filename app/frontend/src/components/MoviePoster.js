import React from 'react';

const MoviePoster = (props) => {

    const className = 'movie-poster-img' + (props.className ? ' ' + props.className : '')
    const src = props.path
        ? "https://image.tmdb.org/t/p/w500/" + props.path
        : "/tmdb/blank-poster.png"

    return (
        <img className={className} style={{...props.style}} src={src} alt="Movie poster" />
    )
}

export default MoviePoster
