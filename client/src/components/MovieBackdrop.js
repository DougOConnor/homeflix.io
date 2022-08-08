import React from 'react';

const MovieBackdrop = (props) => {

    let content = null
    if (props.path) {
        content = <img style={{...props.style}} src={"https://image.tmdb.org/t/p/original/" + props.path} />
    } else {
        content = <div></div>
    } 

    return (
        content
    )
}

export default MovieBackdrop