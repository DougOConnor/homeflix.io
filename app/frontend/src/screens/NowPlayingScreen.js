import React, {useEffect, useState} from 'react';
import axios from 'axios'
import NowPlayingCard from '../components/NowPlayingCard';
import { Icon } from '@iconify/react';

import {
  Card,
  Skeleton
} from '@heroui/react'

const LoadingCard = () => (
  <Card className="w-full bg-content1/80 border border-white/10 p-5 md:p-6">
    <div className='flex flex-col sm:flex-row gap-6 w-full'>
      <Skeleton className="rounded-large w-48 h-72 mx-auto sm:mx-0 flex-shrink-0" />
      <div className="flex-1 pt-2">
        <Skeleton className="w-3/5 rounded-lg h-10" />
        <Skeleton className="w-2/5 h-4 rounded-lg mt-4"/>
        <Skeleton className="w-full h-3 rounded-lg mt-8"/>
        <Skeleton className="w-4/5 h-3 rounded-lg mt-3"/>
        <Skeleton className="w-11/12 h-3 rounded-lg mt-3"/>
        <div className="flex gap-2 mt-6">
          <Skeleton className="w-16 h-6 rounded-full"/>
          <Skeleton className="w-16 h-6 rounded-full"/>
          <Skeleton className="w-16 h-6 rounded-full"/>
        </div>
      </div>
    </div>
  </Card>
)

const NowPlayingScreen = (props) => {
    const [nowPlaying, setNowPlaying] = useState([])
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {
        axios.get("/api/v1/showings").then(response => { setNowPlaying(response.data); setLoaded(true) } )
      }, [])

    return (
        <div className='flex flex-col items-center bg-spotlight min-h-screen pb-24'>
          <div className='w-full max-w-4xl px-4'>
            <div className='flex items-end justify-between border-b border-white/10 pb-3 mt-10'>
              <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
                Now Playing
              </h1>
              <p className='text-foreground/40 text-xs uppercase tracking-[0.25em] hidden sm:block'>
                Tonight at the movies
              </p>
            </div>
        {
          loaded === false ?
          <div className='flex flex-col gap-6 mt-8'>
            <LoadingCard />
            <LoadingCard />
          </div>
        : null
        }
        {
          loaded === true && nowPlaying.length === 0 ?
          <div id="no-movies-found" className='flex flex-col items-center text-center mt-24'>
            <Icon icon="solar:videocamera-record-linear" height={64} className="text-foreground/20 mb-4" />
            <p className='font-marquee text-2xl text-foreground/60'>Intermission</p>
            <p className='text-foreground/40 mt-1'>No movies are currently playing. Check back soon.</p>
          </div>
          : null
        }
          <div className='flex flex-col gap-6 mt-8'>
          {
              nowPlaying.map(movie => (
                  <NowPlayingCard key={movie.showing_id} data={movie} link={true} movie_json={movie.movie_json}/>
              ))
          }
          </div>
          </div>
         </div>
    )
}

export default NowPlayingScreen
