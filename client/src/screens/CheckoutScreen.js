import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import SeatPicker from '../components/SeatPicker';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams, createSearchParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { readUserData } from '../utils/storage';
import NowPlayingCard from '../components/NowPlayingCard'

import MovieBackdrop from '../components/MovieBackdrop';
import MoviePoster from '../components/MoviePoster';

import {
  formatDate,
  formatTime,
} from '../utils/helpers';

const styles = {
    stepLabel: {
        color: 'lightgray'
    },
    buttonContainer: {
        marginTop: 24,
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'flex-end',

    }
}

const CheckoutScreen = (props) => {
    const params = useParams()
    const [theaterLayout, setTheaterLayout] = React.useState({})
    const [renderTheater, setRenderTheater] = React.useState(false)
    const [movie, setMovie] = React.useState({reservations:[], movie: {}})
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectedSnacks, setSelectedSnacks] = React.useState([]);
    const [selectedSeats, setSelectedSeats] = React.useState([]);
    const [snacks, setSnacks] = React.useState([]);
    const [selectedSeatsList, setSelectedSeatsList] = React.useState([]);
    const [user, setUser] = React.useState(readUserData())
    const navigate = useNavigate()
    const [search, setSearch] = useSearchParams();


    React.useEffect(() => {
        axios.get("/api/v1/showings/" + params.id.toString()).then(response => {setMovie(response.data); })
        axios.get("/api/v1/menu").then(response => setSnacks(response.data) )
        axios.get("/api/v1/settings/layout").then(response => {setTheaterLayout(response.data, setRenderTheater(true)) })
        if (search.get('seats')) {
          setSelectedSeats(search.get('seats').split(","))
        }
      }, [])
    
    
    const checkout = () => {
        let userData = readUserData()
        if (userData) {
          axios.post(
            "/api/v1/reservation",
            {
                seats: selectedSeats,
                showing_id: params.id
            },
            {
              headers: {
                "Authorization": "Bearer " + userData.token
              }
            }
          ).then(() => {
              navigate("/checkout/confirmation", { state: {seats: selectedSeats.sort(), movie: movie}})
          })
        } else {
          navigate({
            pathname: "/login",
            search: createSearchParams({
                redirect: window.location.pathname + "?seats=" + selectedSeats.join(","),
            }).toString()
        });
        }
        
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const addSnackItem = (itemId) => {
        let items = [...selectedSnacks]
        items.push(itemId)
        setSelectedSnacks(items)
    }

    const removeSnackItem = (itemId) => {
        let items = [...selectedSnacks]
        items.splice(items.indexOf(itemId), 1)
        setSelectedSnacks(items)
    }

    return (
        <div style={{height: '100%', position: 'relative'}}>
        <MovieBackdrop path={movie.movie.backdrop_path} style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          opacity: .15,
          paddingTop: 16,
          top: 0,
          zindex: -1
          }} />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={12} md={5} lg={5} >
            <Grid container spacing={2} justifyContent="center" alignItems={"flex-start"} sx={{paddingLeft: {xs: "12px", md: "0px"}, paddingRight: {sm: "24px", m: 0}}}>
              <Grid item xs={12} sm={8} md={12} lg={12} >
                <Grid container spacing={2} justifyContent="center" style={{marginTop: 12}}>
                <Grid item xs={4} sm={4} md={4} lg={4} >
                <div>
                {
                  movie.movie.poster_path !== undefined ?
                  <MoviePoster path={movie.movie.poster_path} style={{width: "100%", height: "100%", objectFit: 'contain'}} /> 
                  : <Skeleton variant="rectangular"><MoviePoster path={movie.movie.poster_path} style={{width: "100%", height: "100%", objectFit: 'contain'}} /> </Skeleton>
                }
                </div>
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8} >
                  <div style={{margin: "0px 24px"}}>
                    <Typography sx={{color: 'primary.contrastText'}} variant="h4">{movie.movie.title}</Typography>
                    
                    {
                      movie.movie.overview !== undefined ?
                      <div>
                        <h3>{movie.movie.tagline}</h3>
                        <p style={{margin: 0}}>{formatDate(movie.showing_datetime)}</p> 
                        <p style={{margin: 0}}>{formatTime(movie.showing_datetime)}</p>
                      </div>
                      :
                      <div>
                      <Skeleton variant="text" style={{fontSize: 34, width: "50%"}} />
                      <Skeleton variant="text" style={{width: "80%"}} />
                      <Skeleton variant="text" style={{width: "60%", marginTop: 24}} />
                      <Skeleton variant="text" style={{width: "40%"}} />
                      </div>
                    }
                  </div>
                </Grid>
                </Grid>
            
              <div>
                {
                  movie.movie.overview !== undefined ?
                  <p>{movie.movie.overview}</p>
                  : 
                  <div style={{marginTop: 24}}>
                  <Skeleton variant="text" style={{width: "90%"}} />
                  <Skeleton variant="text" style={{width: "98%"}} />
                  <Skeleton variant="text" style={{width: "86%"}} />
                  <Skeleton variant="text" style={{width: "30%"}} />
                  </div>
                }
                
                <Stack direction="row" spacing={1} flexWrap={'wrap'}>
                  {
                    movie.movie.genres ? 
                      movie.movie.genres.map(genre => {
                        return (<Chip label={genre.name} variant="outlined" />)
                      } )
                    : null
                  }
                </Stack>
                <img style={{maxHeight: 8, marginTop: 24}} src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg" />
              </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5} justifyContent="center" sx={{
            marginTop: "48px",
            borderLeftStyle: "solid",
            boorderLeftWidth: "1px",
            borderLeftColor: "gray",
            }}>
            
                  <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <h3 style={{marginTop: 0}}>Select your seats</h3>
                  {
                    theaterLayout.theaterWidth !== undefined ? 
                    <SeatPicker 
                      movieData={movie}
                      setSelectedSeats={setSelectedSeats}
                      selectedSeats={selectedSeats}
                      theaterLayout={theaterLayout}
                      />
                    : null
                  }
                  
                  </div>
                  <div style={styles.buttonContainer}>
                  <Button
                      style={{marginRight: "8px"}}
                      variant="contained"
                      onClick={checkout}
                      disabled={selectedSeats.length > 0 ? false : true}
                    >
                      Complete
                    </Button>
                  </div>
          </Grid>
        </Grid>
        
      </div>
        
        
    )
}

export default CheckoutScreen