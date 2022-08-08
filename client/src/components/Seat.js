import { usePreviousProps } from '@mui/utils';
import React from 'react';




const Seat = (props) => {

    const active = props.active
    const size = props.size
    let color = active ? '#1976d2' : '#242424'
    const alreadyTaken = props.alreadyTaken  >= 0
    console.log(props.alreadyTaken)
    if (alreadyTaken) {
      color = "#d7465f"
    }


    const seatStyles = {
        container: {
          position: 'relative',
          paddingLeft: (8/52) * size,
          paddingRight: (8/52) * size,
          width: size,
          height:size,
          cursor: 'pointer',
        },
        seat: {
          color: active ? 'white' : "white",
          width: (50/52) * size,
          height: (50/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: '1px solid black',
          textAlign: 'center',
          fontSize: (12/52) * size,
        },
        leftArm : {
          width: (12/52) * size,
          height: (42/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: '1px solid black',
          left: 0
        },
        rightArm : {
          width: (12/52) * size,
          height: (42/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: '1px solid black',
          right: 0
        },
        back : {
          width: (60/52) * size,
          height: (16/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (10/52) * size,
          border: '1px solid black',
          left: (3/52) * size,
          bottom: 0
        }
      }
    
    return (
        <div style={props.style} key={props.seatID}>
        <div style={seatStyles.container} onClick={alreadyTaken ? () => console.log("taken") : () => props.onClick()}>
          <div style={seatStyles.seat}>
              <div style={{margin: 'auto'}}>
                <p>{props.seatID}</p>
              </div>
          </div>
          <div style={seatStyles.leftArm}></div>
          <div style={seatStyles.rightArm}></div>
          <div style={seatStyles.back}></div>
        </div>
        </div>
    )
}

export default Seat