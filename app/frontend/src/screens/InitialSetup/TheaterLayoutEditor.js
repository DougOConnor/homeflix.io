import React, {useState} from 'react';
import axios from 'axios'
import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

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
      "seatSize": .17,
      "rows": [
        {
          'top': .3,
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
    const [saving, setSaving] = useState(false)
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
        setSaving(true)
        axios.post(
            "/api/v1/settings/layout",
            theaterLayout
        ).then(() => {
            navigate("/");
        })
    }


    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-spotlight px-4 py-12'>
        <div className='flex flex-col items-center mb-10 text-center'>
          <Icon icon="solar:armchair-2-linear" className="text-primary mb-3" height={44} />
          <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
            Build Your Theater
          </h1>
          <p className='text-foreground/50 text-xs uppercase tracking-[0.3em] mt-2'>Step 3 of 3 — Seat layout</p>
          <p className='text-foreground/60 text-sm mt-4 max-w-xl'>
            Add the right number of rows and seats, then position them to match your room.
          </p>
        </div>

        <Card className='bg-content1/70 backdrop-blur-md border border-white/10'>
          <CardBody className='p-8 items-center'>
            <SeatPicker
                movieData={{reservations: []}}
                selectedSeats={[]}
                setSelectedSeats={() => {}}
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
            <div className='flex justify-end w-full mt-8'>
              <Button
                id="save-layout"
                color='primary'
                className='font-semibold uppercase tracking-wider px-8'
                endContent={<Icon icon="solar:check-circle-linear" height={18} />}
                onClick={() => saveLayout()}
                isLoading={saving}
              >
                Finish Setup
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
}

export default TheaterLayoutEditor
