import * as React from 'react';
import {
  Button,
  Chip,
  CircularProgress,
  Box,
  Typography
 } from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import MoviePoster from '../components/MoviePoster';

import ShowMoreText from "react-show-more-text";

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
  console.log("mydate", mydate)
  let dateObj = new Date(mydate)
  console.log(dateObj)
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
        <MoviePoster path={props.data.poster_path} style={{height: 300}} />
        <div style={{marginLeft: 12, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <div>
                <h2 style={{color: 'white', marginBottom: 0, marginTop: 0}}>{props.data.title}</h2>
                <h3 style={{marginTop: 0, marginBottom: 0}}>{props.data.display_date}</h3>
                <h3 style={{marginTop: 0, marginBottom: 0}}>{props.data.display_time}</h3>
              </div>
              
              {
                props.movie_json ?
                  props.movie_json.vote_average > 0 ?
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={props.movie_json.vote_average * 10} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 40
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {props.movie_json.vote_average.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              : null
              : null
              
              }
             
            </div>
            
            {
              props.movie_json ? 
              <div>
                <div style={{marginTop: 12, marginBottom: 12}}>
                <ShowMoreText
                  lines={4}
                  more="Show more"
                  less="Show less"
                >
                  {props.movie_json.overview}
                  
                </ShowMoreText>
                </div>
                {
                  props.movie_json.genres.map((genre) => {
                    return <Chip label={genre.name} style={{marginRight: 8}}/>
                  } )
                }
              </div>:
              null
            }
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