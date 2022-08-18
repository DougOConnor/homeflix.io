import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../components/Page'
import NowPlayingCard from '../components/NowPlayingCard';
import { Skeleton } from '@mui/material';


const NowPlayingScreen = (props) => {
    const [nowPlaying, setNowPlaying] = useState([])
    const [loaded, setLoaded] = useState(false)

    

    useEffect(() => {
        axios.get("/api/v1/showings").then(response => {console.log(response.data) ; setNowPlaying(response.data); setLoaded(true) } )
      }, [])

    return (
      <Page>
        {nowPlaying.length == 0 && loaded ? <div id="no-movies-found"><h1>No movies found</h1></div> : null}
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
      </Page>
    )
}

export default NowPlayingScreen