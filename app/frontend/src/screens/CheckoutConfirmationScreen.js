import React from 'react';
import NowPlayingCard from '../components/NowPlayingCard';
import { useLocation, Navigate } from 'react-router-dom';
import { Chip } from '@heroui/react';
import { Icon } from '@iconify/react';


const CheckoutConfirmation = (props) => {
    const {state} = useLocation();

    if (!state || !state.movie) {
      return <Navigate to="/" replace />
    }

    return (
      <div className='min-h-screen bg-spotlight'>
        <div className='w-full flex justify-center'>
          <div className='px-4 py-14 w-full max-w-4xl'>
            <div className='flex flex-col items-center text-center mb-10'>
              <div className='rounded-full bg-primary/15 p-4 mb-4'>
                <Icon icon="solar:ticket-bold" className='text-primary' height={48} />
              </div>
              <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
                Your Seats Are Confirmed!
              </h1>
              <p className='text-foreground/60 mt-2'>We'll see you at the movies.</p>
              <div className='flex flex-wrap justify-center gap-2 mt-6'>
                {
                  (state.seats || []).map(seat => (
                    <Chip
                      key={seat}
                      color='primary'
                      variant='flat'
                      className='font-semibold'
                      startContent={<Icon icon="solar:armchair-2-linear" height={16} />}
                    >
                      {seat}
                    </Chip>
                  ))
                }
              </div>
            </div>
            <NowPlayingCard data={state.movie} showRating={false}/>
          </div>
        </div>
      </div>
    )
}

export default CheckoutConfirmation
