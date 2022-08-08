import * as React from 'react';
import Button from '@mui/material/Button';
import {Link, useNavigate} from 'react-router-dom';
import MoviePoster from '../components/MoviePoster';

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday", 
  "Thursday",
  "Friday",
  "Saturday"
  
]

function formatDate(mydate) {
  let dateObj = new Date(mydate)
  let year = dateObj.getFullYear().toString()
  let month = dateObj.toLocaleString('default', { month: 'long' })
  let weekday = days[dateObj.getDay()]
  let date = dateObj.getDate()
  return weekday + " " + month + " " + date + ", " + year
}

function formatTime(mydate) {
  let dateObj = new Date(mydate)
  let time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  return time
}

export default function NowPlayingCard(props) {
  const navigate = useNavigate()
  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <MoviePoster path={props.data.poster_path} style={{height: 250}} />
        <div style={{marginLeft: 12, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div>
            <h2 style={{color: 'white', marginBottom: 0}}>{props.data.title}</h2>
            <p style={{marginTop: 0, marginBottom: 0}}>{formatDate(props.data.showing_datetime)}</p>
            <p style={{marginTop: 0}}>{formatTime(props.data.showing_datetime)}</p>
            <p>{props.selectedSeats ? "Seats " + props.selectedSeats.join(","): null }</p>
            </div>
            <div style={{height: "100%", display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            {
              props.link === true ? <div><Button style={{marginRight: 24}} variant="contained" onClick={()=> navigate("/checkout/" + props.data.showing_id.toString())}>Reserve</Button></div> : null
            }
            </div>
            
        </div>
      </div>
    </div>
  );
}