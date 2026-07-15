import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Chip, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';

import { formatDate, formatTime } from '../utils/datetime';

const ShowingDetailsScreen = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [showing, setShowing] = useState(null);
    const [videos, setVideos] = useState([]);
    const [cast, setCast] = useState([]);
    const [seatInfo, setSeatInfo] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [trailerPlaying, setTrailerPlaying] = useState(false);

    useEffect(() => {
        axios.get('/api/v1/showings/' + params.id).then(response => {
            setShowing(response.data);
            setLoaded(true);
            const tmdbId = response.data.tmdb_id;
            axios.get('/api/v1/tmdb/movie/' + tmdbId + '/videos').then(r => setVideos(r.data.results || [])).catch(() => {});
            axios.get('/api/v1/tmdb/movie/' + tmdbId + '/credits').then(r => setCast((r.data.cast || []).slice(0, 12))).catch(() => {});
        }).catch(() => setLoaded(true));
        axios.get('/api/v1/showings').then(response => {
            const match = response.data.find(s => s.showing_id.toString() === params.id.toString());
            if (match) {
                setSeatInfo({total: match.seats_total, reserved: match.seats_reserved});
            }
        }).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find(v => v.site === 'YouTube');

    if (!loaded) {
        return (
            <div className='max-w-5xl mx-auto px-4 pt-10'>
                <Skeleton className='w-full h-72 rounded-large' />
                <Skeleton className='w-2/5 h-10 rounded-large mt-6' />
                <Skeleton className='w-full h-32 rounded-large mt-4' />
            </div>
        );
    }

    if (!showing) {
        return (
            <div className='flex flex-col items-center text-center mt-24'>
                <Icon icon="solar:videocamera-record-linear" height={64} className="text-foreground/20 mb-4" />
                <p className='font-marquee text-2xl text-foreground/60'>Showing not found</p>
            </div>
        );
    }

    const movie = showing.movie || {};
    const seatsLeft = seatInfo && seatInfo.total ? Math.max(0, seatInfo.total - seatInfo.reserved) : null;
    const soldOut = seatsLeft !== null && seatsLeft === 0;

    return (
        <div className='relative min-h-screen bg-spotlight pb-24'>
            {/* Backdrop hero */}
            <div className='relative h-[420px]'>
                {
                    movie.backdrop_path ?
                    <div
                        className='absolute inset-0 bg-cover bg-center'
                        style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}
                    /> : <div className='absolute inset-0 bg-content2' />
                }
                <div className='absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20' />
            </div>

            <div className='relative max-w-5xl mx-auto px-4 -mt-56'>
                <div className='flex flex-col md:flex-row gap-8'>
                    <img
                        src={movie.poster_path ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path : "/tmdb/blank-poster.png"}
                        alt={movie.title}
                        className='rounded-large shadow-xl shadow-black/60 ring-1 ring-white/10 w-52 self-center md:self-end flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0 md:pb-2'>
                        <h1 className='font-marquee text-5xl md:text-6xl text-foreground leading-none text-glow-marquee'>{movie.title}</h1>
                        {
                            movie.tagline ?
                            <p className='text-foreground/50 italic mt-2'>{movie.tagline}</p>
                            : null
                        }
                        <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-foreground/70'>
                            <span className='flex items-center gap-1.5'>
                                <Icon icon="solar:calendar-linear" height={16} className='text-primary' />
                                {formatDate(showing.showing_datetime)}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <Icon icon="solar:clock-circle-linear" height={16} className='text-primary' />
                                {formatTime(showing.showing_datetime)}
                            </span>
                            {
                                movie.runtime ?
                                <span className='flex items-center gap-1.5'>
                                    <Icon icon="solar:hourglass-line-linear" height={16} className='text-primary' />
                                    {movie.runtime} min
                                </span> : null
                            }
                            {
                                seatsLeft !== null ?
                                <span className='flex items-center gap-1.5'>
                                    <Icon icon="solar:armchair-2-linear" height={16} className='text-primary' />
                                    {soldOut ? 'Sold out' : seatsLeft + ' seats left'}
                                </span> : null
                            }
                        </div>
                        <div className='flex flex-wrap gap-2 mt-4'>
                            {
                                (movie.genres || []).map(genre => (
                                    <Chip key={genre.id || genre.name} size='sm' variant='bordered' className='border-white/20 text-foreground/70'>
                                        {genre.name}
                                    </Chip>
                                ))
                            }
                        </div>
                        <Button
                            color='primary'
                            radius='full'
                            size='lg'
                            className='font-semibold uppercase tracking-wider px-10 mt-6 shadow-marquee'
                            startContent={<Icon icon="solar:ticket-bold" height={20} />}
                            isDisabled={soldOut}
                            onClick={() => navigate('/checkout/' + showing.showing_id)}
                        >
                            {soldOut ? 'Sold Out' : 'Reserve Seats'}
                        </Button>
                    </div>
                </div>

                {/* Overview */}
                <div className='mt-12 max-w-3xl'>
                    <h2 className='font-marquee text-2xl text-foreground mb-3'>The Story</h2>
                    <p className='text-foreground/70 leading-relaxed'>{movie.overview}</p>
                </div>

                {/* Trailer — facade first so YouTube's title bar chrome never shows;
                    the iframe only loads (autoplaying) once the guest hits play. */}
                {
                    trailer ?
                    <div className='mt-12'>
                        <h2 className='font-marquee text-2xl text-foreground mb-4'>Trailer</h2>
                        <div className='relative w-full max-w-3xl rounded-large overflow-hidden border border-white/10 bg-black' style={{aspectRatio: '16 / 9'}}>
                            {
                                trailerPlaying ?
                                <iframe
                                    title={trailer.name}
                                    src={"https://www.youtube-nocookie.com/embed/" + trailer.key + "?autoplay=1&rel=0&iv_load_policy=3&playsinline=1"}
                                    className='absolute inset-0 w-full h-full'
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                :
                                <button
                                    type="button"
                                    className='absolute inset-0 w-full h-full group cursor-pointer'
                                    onClick={() => setTrailerPlaying(true)}
                                    aria-label="Play trailer"
                                >
                                    <img
                                        src={"https://i.ytimg.com/vi/" + trailer.key + "/maxresdefault.jpg"}
                                        onError={(e) => { e.target.src = "https://i.ytimg.com/vi/" + trailer.key + "/hqdefault.jpg"; }}
                                        alt=""
                                        className='absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30' />
                                    <div className='absolute inset-0 flex flex-col items-center justify-center gap-3'>
                                        <div className='rounded-full bg-primary p-5 shadow-marquee group-hover:scale-110 transition-transform'>
                                            <Icon icon="solar:play-bold" height={32} className='text-primary-foreground ml-1' />
                                        </div>
                                        <span className='text-foreground/80 text-xs uppercase tracking-[0.3em] font-semibold'>
                                            Play Trailer
                                        </span>
                                    </div>
                                </button>
                            }
                        </div>
                    </div>
                    : null
                }

                {/* Cast */}
                {
                    cast.length > 0 ?
                    <div className='mt-12'>
                        <h2 className='font-marquee text-2xl text-foreground mb-4'>Cast</h2>
                        <div className='flex gap-4 overflow-x-auto no-scrollbar pb-2'>
                            {
                                cast.map(person => (
                                    <div key={person.id} className='flex-shrink-0 w-28 text-center'>
                                        {
                                            person.profile_path ?
                                            <img
                                                src={"https://image.tmdb.org/t/p/w185" + person.profile_path}
                                                alt={person.name}
                                                className='w-28 h-36 object-cover rounded-large ring-1 ring-white/10'
                                            />
                                            :
                                            <div className='w-28 h-36 rounded-large bg-content2 flex items-center justify-center'>
                                                <Icon icon="solar:user-linear" height={32} className='text-foreground/20' />
                                            </div>
                                        }
                                        <p className='text-xs font-semibold text-foreground mt-2 line-clamp-1'>{person.name}</p>
                                        <p className='text-[11px] text-foreground/50 line-clamp-1'>{person.character}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    : null
                }

                <img
                    className='mt-12 opacity-60'
                    style={{maxHeight: 8}}
                    alt="TMDB"
                    src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg"
                />
            </div>
        </div>
    );
}

export default ShowingDetailsScreen;
