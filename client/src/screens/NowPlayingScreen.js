import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Page from '../components/Page'
import NowPlayingCard from '../components/NowPlayingCard';


const NowPlayingScreen = (props) => {
    const [nowPlaying, setNowPlaying] = useState([])

    

    useEffect(() => {
        axios.get("/api/v1/showings").then(response => {console.log(response.data) ; setNowPlaying(response.data) } )
      }, [])

    return (
      <Page>
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