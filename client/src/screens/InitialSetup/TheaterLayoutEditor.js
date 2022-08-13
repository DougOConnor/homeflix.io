import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../../components/Page'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { readUserData } from '../../utils/storage';

import SeatPicker from '../../components/SeatPicker';

const rowMap = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J',
    10: 'K',
    11: 'L'
}

const initialLayout = {
    "theaterWidth": 1,
    "theaterLength": 1,
    "seating": {
      "seatSize": .19,
      "rows": [
        {
          'top': .35,
          'seats': [
            {
              "seatID": 'A1',
            },
            {
              "seatID": 'A2',
            },
            {
              "seatID": 'A3',
            },
            {
              "seatID": 'A4',
            }
          ]
        },
        {
          'top': .2,
          'seats': [
            {
              "seatID": 'B1'
            },
            {
              "seatID": 'B2'
            },
            {
              "seatID": 'B3'
            },
            {
              "seatID": 'B4'
            }
          ]
        }
      ]
    }
  }

const TheaterLayoutEditor = (props) => {
    const [theaterLayout, setTheaterLayout] = useState(initialLayout)
    const navigate = useNavigate()

    const moveRow = (rowIndex, increment) => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let currentValue = layout["seating"]["rows"][rowIndex].top
        layout["seating"]["rows"][rowIndex].top = (currentValue + increment)
        setTheaterLayout(layout)
    }

    const addSeat = (rowIndex) => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let seatCount = layout["seating"]["rows"][rowIndex].seats.length + 1
        layout["seating"]["rows"][rowIndex].seats.push({
            seatID: rowMap[rowIndex] + seatCount.toString()
        })
        setTheaterLayout(layout)
    }

    const removeSeat = (rowIndex) => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let seatCount = layout["seating"]["rows"][rowIndex].seats.length
        let seats = layout["seating"]["rows"][rowIndex].seats.slice(0, seatCount - 1)
        layout["seating"]["rows"][rowIndex].seats = seats
        setTheaterLayout(layout)
    }

    const addRow = () => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let rowCount = layout["seating"]["rows"].length
        let rows = layout["seating"]["rows"]

        rows.push({
            top: .2,
            seats: [{seatID: rowMap[rowCount] + "1" }]
        })
        layout["seating"]["rows"] = rows
        setTheaterLayout(layout)
    }

    const removeRow = () => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let rowCount = layout["seating"]["rows"].length
        let rows = layout["seating"]["rows"].slice(0, rowCount - 1)
        layout["seating"]["rows"] = rows
        setTheaterLayout(layout)
    }

    const incrementSeatSize = (increment) => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let currentSize = layout.seating.seatSize
        layout.seating.seatSize = currentSize + increment
        setTheaterLayout(layout)
    }

    const incrementSeatLocation = (rowIndex, seatIndex, increment) => {
        let layout = JSON.parse(JSON.stringify(theaterLayout))
        let currentAmount = layout.seating.rows[rowIndex].seats[seatIndex].marginLeft
        if (currentAmount === undefined) { 
            currentAmount = 0
        }
        layout.seating.rows[rowIndex].seats[seatIndex].marginLeft = currentAmount + increment
        setTheaterLayout(layout)
    }

    const saveLayout = () => {
        const userData = readUserData()
        axios.post(
            "/api/v1/settings/layout",
            theaterLayout,
            {
              headers: {
                  "Authorization": "Bearer " + userData.token
              }
          }
        ).then(() => {
            navigate("/");
            window.location.reload()
        })
    }


    return (
      <Page>
        
        <div style={{padding: 24}}>
        <h2 level="h2" >First setup your theater below by adding the correct amount on rows and seats, then positioning them properly in your theater</h2>
        
        <div style={{
            marginTop: 48,
            display: 'flex',
            justifyContent: 'center',
        }}>
        <SeatPicker
            movieData={{reservations: []}}
            selectedSeats={[]}
            setSelectedSeats={console.log("none")}
            displayOnly={true}
            layoutEditor={true}
            theaterLayout={theaterLayout}
            moveRowUp={(index) => moveRow(index, -.01)}
            moveRowDown={(index) => moveRow(index, .01)}
            addSeat={(index) => addSeat(index)}
            removeSeat={(index) => removeSeat(index)}
            addRow={() => addRow()}
            removeRow={() => removeRow()}
            increaseSeatSize={() => incrementSeatSize(.01)}
            decreaseSeatSize={() => incrementSeatSize(-.01)}
            moveSeatRight={(rowIndex, seatIndex) => incrementSeatLocation(rowIndex, seatIndex, .01)}
            moveSeatLeft={(rowIndex, seatIndex) => incrementSeatLocation(rowIndex, seatIndex, -.01)}
            />
        
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 48}}>
            <Button id="save-layout" variant='contained' onClick={() => saveLayout()} >Save</Button>
        </div>
        </div>
      </Page>
    )
}

export default TheaterLayoutEditor