import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import Row from './Row'
import Seat from './Seat'


const LegendSwatch = ({color, glow, label}) => (
  <div className='flex items-center gap-2'>
    <div
      className='w-4 h-4 rounded'
      style={{
        backgroundColor: color,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: glow ? '0 0 8px rgba(217, 38, 55, 0.6)' : 'none',
      }}
    />
    <p className='text-xs text-foreground/60 m-0'>{label}</p>
  </div>
)

const EditorControl = ({id, icon, onClick, color = "default"}) => (
  <Button
    id={id}
    isIconOnly
    size="sm"
    variant="flat"
    color={color}
    className="min-w-7 w-7 h-7"
    onClick={onClick}
  >
    <Icon icon={icon} height={16} />
  </Button>
)

const SeatPicker = (props) => {

    const isEditor = props.layoutEditor === true
    // Editor mode reserves side gutters so the floating row/seat controls
    // stay inside the layout instead of overflowing off-screen.
    const GUTTER_LEFT = 44
    const GUTTER_RIGHT = 84
    const width = window.innerWidth || document.documentElement.clientWidth || 1024;
    const theaterWidth = Math.min(500, width - (isEditor ? 40 + GUTTER_LEFT + GUTTER_RIGHT : 20))
    const theaterLength = theaterWidth * (props.theaterLayout.theaterLength / props.theaterLayout.theaterWidth)
    const seatSize = theaterWidth * props.theaterLayout.seating.seatSize

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
            <div className='mb-6 flex flex-col gap-3' style={{width: theaterWidth}}>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-foreground/70 m-0'>Rows</p>
                <div className='flex gap-2'>
                  <EditorControl id='add-row' icon='solar:add-circle-linear' color='primary' onClick={() => props.addRow()} />
                  <EditorControl id='remove-row' icon='solar:minus-circle-linear' color='danger' onClick={() => props.removeRow()} />
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-foreground/70 m-0'>Seat Size</p>
                <div className='flex gap-2'>
                  <EditorControl id='increase-seat-size' icon='solar:add-circle-linear' color='primary' onClick={() => props.increaseSeatSize()} />
                  <EditorControl id='decrease-seat-size' icon='solar:minus-circle-linear' color='danger' onClick={() => props.decreaseSeatSize()} />
                </div>
              </div>
            </div>
            :
            <div className='flex justify-center gap-6 flex-wrap mt-5 mb-4'>
              <LegendSwatch color='#2e2e42' label='Available' />
              <LegendSwatch color='#d92637' glow label='Selected' />
              <LegendSwatch color='#1b1b24' label='Taken' />
            </div>
          }
        <div style={isEditor ? {paddingLeft: GUTTER_LEFT, paddingRight: GUTTER_RIGHT, paddingBottom: 44} : undefined}>
        <div
          className='rounded-2xl border border-white/10 bg-black/40'
          style={{
            height: theaterLength,
            width: theaterWidth,
            padding: 20,
          }}
        >
          {/* The screen */}
          <div className='relative mb-2'>
            <div
              className='w-11/12 mx-auto h-2 rounded-b-[100%] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent'
              style={{boxShadow: '0 8px 32px 4px rgba(180, 200, 255, 0.25)'}}
            />
            <p className='text-center text-[10px] uppercase tracking-[0.4em] text-foreground/40 mt-2 m-0'>Screen</p>
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
                        left: -36,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <EditorControl id={"row-" + index.toString() + "-move-up"} icon='solar:alt-arrow-up-linear' onClick={() => props.moveRowUp(index)} />
                        <EditorControl id={"row-" + index.toString() + "-move-down"} icon='solar:alt-arrow-down-linear' onClick={() => props.moveRowDown(index)} />
                      </div>
                    </div>
                    : null
                  }

                  <Row style={{marginTop: theaterLength * row.top}}>
                    {
                      row['seats'].map((seat, index) => {
                        return (
                          <div key={seat["seatID"]} style={{marginLeft: seat.marginLeft !== undefined ? seat.marginLeft * theaterWidth : null}}>
                          <div style={{position: 'relative'}}>
                          <Seat
                            zIndex={props.seatZindex}
                            seatID={seat["seatID"]}
                            alreadyTaken={props.displayOnly === true ? -1 : props.movieData.reservations.indexOf(seat["seatID"]) }
                            size={seatSize}
                            active={props.displayOnly === true ? false : props.selectedSeats.indexOf(seat["seatID"]) > -1}
                            onClick={() => toggleSeat(seat["seatID"])}
                            />
                            {
                              props.layoutEditor === true ?
                              <div style={{
                                position: 'absolute',
                                bottom: -34,
                                left: 0,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2
                              }}>
                                <EditorControl id={seat["seatID"] + "-move-left"} icon='solar:alt-arrow-left-linear' onClick={() => props.moveSeatLeft(rowIndex, index)} />
                                <EditorControl id={seat["seatID"] + "-move-right"} icon='solar:alt-arrow-right-linear' onClick={() => props.moveSeatRight(rowIndex, index)} />
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
                        right: -72,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                      }}>
                        <EditorControl id={"row-" + index.toString() + "-add-seat"} icon='solar:add-circle-linear' color='primary' onClick={() => props.addSeat(index)} />
                        <EditorControl id={"row-" + index.toString() + "-remove-seat"} icon='solar:minus-circle-linear' color='danger' onClick={() => props.removeSeat(index)} />
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
        </div>
    )
}

export default SeatPicker
