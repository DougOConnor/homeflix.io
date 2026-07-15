import React from 'react';


const COLORS = {
  available: '#2e2e42',
  selected: '#d92637',
  taken: '#1b1b24',
}

const Seat = (props) => {

    const active = props.active
    const size = props.size
    const zIndex = props.zIndex || 0
    const alreadyTaken = props.alreadyTaken >= 0

    let color = active ? COLORS.selected : COLORS.available
    if (alreadyTaken) {
      color = COLORS.taken
    }

    const border = active ? '1px solid #f4a6b0' : '1px solid rgba(255,255,255,0.14)'
    const glow = active ? '0 0 12px rgba(217, 38, 55, 0.6)' : 'none'

    const seatStyles = {
        container: {
          position: 'relative',
          paddingLeft: (8/52) * size,
          paddingRight: (8/52) * size,
          width: size + (14/52) * size,
          height: size,
          cursor: alreadyTaken ? 'not-allowed' : 'pointer',
          opacity: alreadyTaken ? 0.55 : 1,
          transition: 'transform 0.1s ease',
        },
        seat: {
          color: active ? '#ffffff' : 'rgba(255,255,255,0.75)',
          fontWeight: 600,
          width: (50/52) * size,
          height: (50/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: border,
          textAlign: 'center',
          fontSize: (12/52) * size,
          zIndex: zIndex,
          paddingTop: (8/52) * size,
          boxShadow: glow,
          transition: 'background-color 0.15s ease, box-shadow 0.15s ease',
        },
        leftArm : {
          width: (12/52) * size,
          height: (42/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: border,
          left: 0,
          zIndex: zIndex,
          transition: 'background-color 0.15s ease',
        },
        rightArm : {
          width: (12/52) * size,
          height: (42/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (6/52) * size,
          border: border,
          right: 0,
          zIndex: zIndex,
          transition: 'background-color 0.15s ease',
        },
        back : {
          width: (60/52) * size,
          height: (16/52) * size,
          backgroundColor: color,
          position: 'absolute',
          borderRadius: (10/52) * size,
          border: border,
          left: (3/52) * size,
          bottom: 0,
          zIndex: zIndex,
          transition: 'background-color 0.15s ease',
        }
      }

    return (
        <div style={props.style} key={props.seatID} >
        <div style={seatStyles.container} onClick={alreadyTaken ? () => {} : () => props.onClick()}>
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
