import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../components/Page'
import NowPlayingCard from '../components/NowPlayingCard';
import { useLocation } from 'react-router-dom';


const CheckoutConfirmation = (props) => {
    const {state} = useLocation();

    return (
      <Page>
          <div style={{padding: 24}}> 
          <h2>Your seats are confirmed! We'll see you at the movies.</h2>
          <NowPlayingCard data={state.movie} selectedSeats={state.seats}/>
          </div>
      </Page>
    )
}

export default CheckoutConfirmation