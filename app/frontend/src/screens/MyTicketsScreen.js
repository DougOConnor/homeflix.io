import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, Chip, Skeleton, Button } from '@heroui/react';
import { Icon } from '@iconify/react';

import { formatDate, formatTime } from '../utils/datetime';

const MyTicketsScreen = (props) => {
    const [tickets, setTickets] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/v1/reservation/mine').then(response => {
            setTickets(response.data);
            setLoaded(true);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                // Not signed in — go log in, then come straight back here
                navigate('/login?redirect=' + encodeURIComponent('/my-tickets'), { replace: true });
                return;
            }
            setLoaded(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex flex-col items-center bg-spotlight min-h-screen pb-24'>
          <div className='w-full max-w-3xl px-4'>
            <div className='flex items-end justify-between border-b border-white/10 pb-3 mt-10'>
              <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
                My Tickets
              </h1>
              <p className='text-foreground/40 text-xs uppercase tracking-[0.25em] hidden sm:block'>
                Your reservations
              </p>
            </div>

            {
              !loaded ?
              <div className='flex flex-col gap-4 mt-8'>
                <Skeleton className='w-full h-28 rounded-large' />
                <Skeleton className='w-full h-28 rounded-large' />
              </div>
              : null
            }

            {
              loaded && tickets.length === 0 ?
              <div className='flex flex-col items-center text-center mt-24'>
                <Icon icon="solar:ticket-linear" height={64} className="text-foreground/20 mb-4" />
                <p className='font-marquee text-2xl text-foreground/60'>No tickets yet</p>
                <p className='text-foreground/40 mt-1'>Reserve seats for a showing and your tickets will appear here.</p>
                <Button
                  color='primary'
                  variant='flat'
                  className='font-semibold uppercase tracking-wider mt-6'
                  onClick={() => navigate('/')}
                >
                  See What's Playing
                </Button>
              </div>
              : null
            }

            <div className='flex flex-col gap-4 mt-8'>
              {
                tickets.map(ticket => (
                  <Card
                    key={ticket.showing_id}
                    isPressable
                    onPress={() => navigate('/my-tickets/' + ticket.showing_id)}
                    className='bg-content1/80 border border-white/10 w-full'
                  >
                    {
                      ticket.backdrop_path ?
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none"
                        style={{backgroundImage: `url(https://image.tmdb.org/t/p/w780${ticket.backdrop_path})`}}
                      /> : null
                    }
                    <div className='relative flex flex-row items-center gap-4 p-4 w-full'>
                      <img
                        src={ticket.poster_path ? "https://image.tmdb.org/t/p/w185/" + ticket.poster_path : "/tmdb/blank-poster.png"}
                        alt={ticket.title}
                        className='w-16 rounded-medium object-cover ring-1 ring-white/10 flex-shrink-0'
                      />
                      <div className='flex flex-col items-start min-w-0 flex-1'>
                        <p className='font-marquee text-2xl text-foreground truncate max-w-full'>{ticket.title}</p>
                        <p className='text-xs text-foreground/50 mt-1 flex items-center gap-1.5'>
                          <Icon icon="solar:calendar-linear" height={14} className='text-primary' />
                          {formatDate(ticket.showing_datetime)} · {formatTime(ticket.showing_datetime)}
                        </p>
                        <div className='flex flex-wrap gap-1.5 mt-2'>
                          {
                            ticket.seats.map(seat => (
                              <Chip key={seat} size='sm' color='primary' variant='flat' className='font-semibold'>{seat}</Chip>
                            ))
                          }
                        </div>
                      </div>
                      <Icon icon="solar:alt-arrow-right-linear" height={22} className='text-foreground/30 flex-shrink-0' />
                    </div>
                  </Card>
                ))
              }
            </div>
          </div>
        </div>
    )
}

export default MyTicketsScreen
