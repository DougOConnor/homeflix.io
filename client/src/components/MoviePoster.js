import React from 'react';

const MoviePoster = (props) => {

    let content = null
    if (props.path) {
        content = <img style={{...props.style}} src={"https://image.tmdb.org/t/p/w500/" + props.path} />
    } else {
        content = <img style={{...props.style}} src={"/tmdb/blank-poster.png"} />
    } 

    return (
        content
    )
}

export default MoviePoster