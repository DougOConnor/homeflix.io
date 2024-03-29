import React from 'react';

const MoviePoster = (props) => {

    let content = null
    if (props.path) {
        content = <img className='movie-poster-img' style={{...props.style, aspectRatio: .667}} src={"https://image.tmdb.org/t/p/w500/" + props.path} />
    } else {
        content = <img className='movie-poster-img' style={{...props.style, aspectRatio: .667}} src={"/tmdb/blank-poster.png"} />
    } 

    return (
        content
    )
}

export default MoviePoster