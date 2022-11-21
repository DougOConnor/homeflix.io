import React, {useEffect, useState} from 'react';
import axios from 'axios'
import NowPlayingCard from '../components/NowPlayingCard';
import { Skeleton } from '@mui/material';
import { readUserData } from '../utils/storage';
import { Grid } from '@mui/material';
import MoviePoster from '../components/MoviePoster';

import {
  formatDate,
  formatTime
} from '../utils/helpers'

const headerStyle = {
  marginTop: 8
}

const nyReservationsStyle = {
  title: {
    margin: 0,
    fontSize: 18
  },
  body : {
    margin: 0,
    fontSize: 16
  }
  
}

const NowPlayingScreen = (props) => {
    const [nowPlaying, setNowPlaying] = useState([])
    const [myReservations, setMyReservations] = useState([])
    const [loaded, setLoaded] = useState(false)

    console.log("resy", Object.keys(myReservations).length)

    const getMyReservations = () => {
      const userData = readUserData()
      console.log(userData)
      if (userData) {
        let myTickets = {}
        axios.get(
          '/api/v1/user/reservations',
          {
            headers: {
              "Authorization": "Bearer " + userData.token
            }
          }
          ).then(data => {
          data.data.map(reservation => {
            if (myTickets[reservation.showing_id] === undefined) {
              myTickets[reservation.showing_id] = {
                title: reservation.title,
                poster_path: reservation.poster_path,
                showing_datetime: reservation.showing_datetime,
                display_date: reservation.display_date,
                display_time: reservation.display_time,
                seats: []
              }
            }
            myTickets[reservation.showing_id].seats.push(reservation.seat_id)
          })
          setMyReservations(myTickets)
          console.log(myTickets)
        })
      }
    }

    useEffect(() => {
        axios.get("/api/v1/showings").then(response => {console.log(response.data) ; setNowPlaying(response.data); setLoaded(true) } )
        getMyReservations()
      }, [])

    return (
        <Grid container spacing={2} justifyContent={'center'} style={{marginTop: 24}}>
          <Grid item xs={12} lg={11} xl={8}>
          <Grid container spacing={2}>
          <Grid item xs={12} lg={8} style={{padding: "0px 32px"}}>
            <div style={{borderBottom: '1px solid darkgrey'}}>
              <h2 style={headerStyle}>Now Playing</h2>
            </div>
        {
          loaded == false ?
          <div>
          <div style={{display: 'flex', marginTop: 24}}>
            <Skeleton variant="rectangular" width={169} height={250}/>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 24, flexGrow: 1}}>
              <Skeleton variant="text" style={{fontSize: 34, width: "60%"}}/>
              <Skeleton variant="text" style={{}}/>
              <Skeleton variant="text" style={{}}/>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: 24}}>
            <Skeleton variant="rectangular" width={169} height={250}/>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 24, flexGrow: 1}}>
              <Skeleton variant="text" style={{fontSize: 34, width: "60%"}}/>
              <Skeleton variant="text" style={{}}/>
              <Skeleton variant="text" style={{}}/>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: 24}}>
            <Skeleton variant="rectangular" width={169} height={250}/>
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: 24, flexGrow: 1}}>
              <Skeleton variant="text" style={{fontSize: 34, width: "60%"}}/>
              <Skeleton variant="text" style={{}}/>
              <Skeleton variant="text" style={{}}/>
            </div>
          </div>
        </div>
        : null
        }
        {
          loaded == true  && nowPlaying.length === 0 ?
          <div id="no-movies-found">
            <p style={{marginTop: 24}}>No movies are currently playing.</p>
          </div>
          : null
        }
          {
              nowPlaying.map(movie => {
                  return(
                      <div style={{ marginTop: 12}}>
                      <NowPlayingCard data={movie} link={true}/>
                      <div style={{padding: 24}}>
                          <div style={{borderBottom: "1px solid #2c2c2c"}}>

                          </div>
                      </div>
                      </div>
                  )
              })
          }
          </Grid>
          <Grid item xs={12} lg={4} style={{backgroundColor: "#1a1a1a", padding: "12px 32px 24px 32px", height: 'fit-content'}}>
            <h2 style={headerStyle}>My Reservations</h2>
            {
              Object.keys(myReservations).length === 0 ? <p>Looks like you don't have any showings booked yet.</p> : null
            }
            {
              
              Object.keys(myReservations).map(reservation => {
                return(
                  <div style={{flexDirection: 'row', display: 'flex', marginBottom: 12}}>
                    <MoviePoster path={myReservations[reservation].poster_path} style={{width: 65, marginRight: 12}}/>
                    <div>
                      <h2 style={nyReservationsStyle.title} >{myReservations[reservation].title}</h2>
                      <p style={nyReservationsStyle.body}>{myReservations[reservation].display_date}</p>
                      <p style={nyReservationsStyle.body}>{myReservations[reservation].display_time}</p>
                      <p style={nyReservationsStyle.body}>Seats: {myReservations[reservation].seats.join(", ")}</p>
                    </div>
                  </div>
                )}
              )
            }
          </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
}

export default NowPlayingScreen