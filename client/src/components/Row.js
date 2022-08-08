import React from 'react';



const Row = (props) => {

    return (
        <div style={props.style}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          {props.children}
        </div>
        </div>
    )
}

export default Row