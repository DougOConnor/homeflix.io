import React, {useState, useWindowDimensions} from 'react';

import Row from './Row'
import Seat from './Seat'
import NowPlayingCard from './NowPlayingCard';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const AddStyle = {backgroundColor: 'lightgreen', height: 25}
const RemoveStyle = {backgroundColor: 'lightpink', height: 25, marginLeft: 5}

const SeatPicker = (props) => {

    const width = window.innerWidth;
    const theaterWidth = Math.min(400, width -100)
    const theaterLength = theaterWidth * (props.theaterLayout.theaterLength / props.theaterLayout.theaterWidth)
    const seatSize = theaterWidth * props.theaterLayout.seating.seatSize

  
    const styles = {
        theater: {
          height: theaterLength,
          width: theaterWidth,
          backgroundColor: 'darkgrey',
          padding: 20,
          border: "1px solid black",
        }
    }

    const toggleSeat = function (seatID) {
        let editseats = [...props.selectedSeats]
        let index = editseats.indexOf(seatID)
        if (index < 0) {
          editseats.push(seatID)
        } else {
          editseats.splice(index, 1)
        }
        props.setSelectedSeats(editseats)
    }


    return (
        <div>
          {
            props.layoutEditor === true ? 
            <div style={{width: theaterWidth / 2}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>Rows</div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={AddStyle} onClick={() => props.addRow()}><AddIcon/></div>
                  <div style={RemoveStyle} onClick={() => props.removeRow()}><RemoveIcon/></div>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 4, marginBottom: 24}}>
                <div>Seat Size</div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={AddStyle} onClick={() => props.increaseSeatSize()}><AddIcon/></div>
                  <div style={RemoveStyle} onClick={() => props.decreaseSeatSize()}><RemoveIcon/></div>
                </div>
              </div>
            </div>
            : 
            <div style={{marginTop: 20, marginBottom: 10, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: 20, backgroundColor: '#1976d2'}}></div>
              <p style={{margin: 0, marginLeft: 6, fontSize: 12}}>Selected</p>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{width: 20, backgroundColor: '#d7465f'}}></div>
              <p style={{margin: 0, marginLeft: 6, fontSize: 12}}>Not Available</p>
            </div>
            <div style={{display: 'flex'}}>
              <div style={{width: 20, backgroundColor: '#242424'}}></div>
              <p style={{margin: 0, marginLeft: 6, fontSize: 12}}>Available</p>
            </div>
          </div>
          }
        <div style={styles.theater}>
          <div style={{
            width: "100%",
            border: 'solid 1px black',
            textAlign: 'center',
            backgroundColor: '#242424',
            color: 'white'
            }}>
            SCREEN
          </div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
          {
            props.theaterLayout.seating.rows.map( (row, index) => {
              let rowIndex = index
              return(
                <div key={"row-" + index.toString()} style={{display: 'flex', flexDirection: 'row'}}>
                  {
                    props.layoutEditor === true ? 
                    <div style={{position: 'relative'}}>
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: -20
                      }}>
                        <div className='arrow-up'  onClick={() => props.moveRowUp(index)}></div>
                        <div className='arrow-down' onClick={() => props.moveRowDown(index)}></div>
                      </div>
                    </div> 
                    : null
                  }
                  
                  <Row style={{marginTop:theaterLength * row.top}}>
                    {
                      row['seats'].map((seat, index) => {
                        return (
                          <div key={seat["seatID"]} style={{marginLeft: seat.marginLeft !== undefined ? seat.marginLeft * theaterWidth: null}}>
                          <div style={{position: 'relative'}}>
                          <Seat
                            
                            seatID={seat["seatID"]}
                            alreadyTaken={props.displayOnly === true ? -1 : props.movieData.reservations.indexOf(seat["seatID"]) }
                            size={seatSize}
                            active={props.displayOnly === true ? false :  props.selectedSeats.indexOf(seat["seatID"]) > -1} //props.selectedSeats[seat["seatID"]].active}
                            onClick={() => toggleSeat(seat["seatID"])} 
                            />
                            {
                              props.layoutEditor === true ? 
                              <div style={{
                                position: 'absolute',
                                bottom: -26,
                                left: 5
                              }}>
                              <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div className='arrow-left'  onClick={() => props.moveSeatLeft(rowIndex, index)}></div>
                                <div className='arrow-right' onClick={() => props.moveSeatRight(rowIndex, index)}></div>
                              </div>
                                
                              </div>
                              : null
                            }
                            
                            </div>
                            </div>
                        )
                      })
                    }
                  </Row>
                  {
                    props.layoutEditor === true ? 
                    <div style={{position: 'relative'}}>
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: -56
                      }}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                          <div style={AddStyle} onClick={() => props.addSeat(index)}><AddIcon/></div>
                          <div style={RemoveStyle} onClick={() => props.removeSeat(index)}><RemoveIcon /></div>
                        </div>
                      </div>
                    </div> 
                    : null
                  }
                  
                </div>
              )
            })
          }
          </div>
          </div>
        </div>
        </div>
    )
}

export default SeatPicker