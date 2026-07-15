import React from 'react';

import SeatPicker from '../components/SeatPicker';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { useNavigate, useParams, createSearchParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

import MovieBackdrop from '../components/MovieBackdrop';
import MoviePoster from '../components/MoviePoster';
import { formatDate, formatTime } from '../utils/datetime';


const CheckoutScreen = (props) => {
    const params = useParams()
    const [theaterLayout, setTheaterLayout] = React.useState({})
    const [movie, setMovie] = React.useState({reservations:[], movie: {}})
    const [selectedSeats, setSelectedSeats] = React.useState([]);
    const [snacks, setSnacks] = React.useState([]);
    const [snackQty, setSnackQty] = React.useState({});
    const navigate = useNavigate()
    const [search] = useSearchParams();


    React.useEffect(() => {
        axios.get("/api/v1/showings/" + params.id.toString()).then(response => {
          setMovie(response.data);
          // Restore seats from the URL (e.g. returning from login), but
          // drop any that were taken in the meantime.
          if (search.get('seats')) {
            const reserved = response.data.reservations || [];
            const requested = search.get('seats').split(",").filter(s => s);
            const stillAvailable = requested.filter(seat => reserved.indexOf(seat) === -1);
            if (stillAvailable.length < requested.length) {
              toast.warn("Some of your seats were taken while you were away — please review your selection.", { toastId: "seats-taken" });
            }
            setSelectedSeats(stillAvailable);
          }
        })
        axios.get("/api/v1/settings/layout").then(response => {setTheaterLayout(response.data) })
        axios.get("/api/v1/menu").then(response => {setSnacks(response.data)}).catch(() => {})
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    const changeSnackQty = (snack_id, delta) => {
        setSnackQty(prev => {
          const next = {...prev};
          next[snack_id] = Math.max(0, (next[snack_id] || 0) + delta);
          return next;
        });
    }

    const snackOrderItems = () => Object.keys(snackQty)
        .filter(id => snackQty[id] > 0)
        .map(id => ({snack_id: parseInt(id), qty: snackQty[id]}));

    const snackTotal = snacks.reduce((sum, snack) => sum + (snackQty[snack.snack_id] || 0) * (snack.price || 0), 0);

    const goToLogin = () => {
        navigate({
          pathname: "/login",
          search: createSearchParams({
              redirect: window.location.pathname + "?seats=" + selectedSeats.join(","),
          }).toString()
        });
    }

    const refreshAvailability = () => {
        axios.get("/api/v1/showings/" + params.id.toString()).then(response => {
          setMovie(response.data);
          const reserved = response.data.reservations || [];
          setSelectedSeats(prev => prev.filter(seat => reserved.indexOf(seat) === -1));
        })
    }

    const checkout = () => {
        const userData = props.user
        if (!userData || !(userData.user_id || userData.email)) {
          goToLogin();
          return;
        }
        axios.post(
          "/api/v1/reservation",
          {
              seats: selectedSeats,
              showing_id: params.id
          }
        ).then(async (response) => {
            if (response.data && response.data.status === "error") {
              toast.error(response.data.error || "Those seats were just taken — please pick again.");
              refreshAvailability();
              return;
            }
            const items = snackOrderItems();
            if (items.length > 0) {
              try {
                await axios.post("/api/v1/menu/order", { showing_id: params.id, items: items });
              } catch (e) {
                toast.warn("Seats booked, but the snack order didn't go through.");
              }
            }
            navigate("/checkout/confirmation", { state: {seats: [...selectedSeats].sort(), movie: movie}})
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
              goToLogin();
            } else {
              toast.error("Something went wrong booking your seats. Please try again.");
            }
        })
    }

    return (
        <div className='relative min-h-screen'>
          {/* Fixed, dimmed backdrop art */}
          <MovieBackdrop path={movie.movie.backdrop_path} style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "fixed",
            opacity: .18,
            top: 0,
            pointerEvents: 'none',
          }} />
          <div className='fixed inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background pointer-events-none' />

          <div className="relative flex flex-wrap justify-center gap-10 px-4 pt-10 pb-24 max-w-6xl mx-auto">
            {/* Movie details */}
            <div className='w-full lg:w-5/12'>
              <div className='flex flex-row gap-6'>
                <div className='w-4/12 flex-shrink-0'>
                  {
                    movie.movie.poster_path !== undefined ?
                    <MoviePoster
                      path={movie.movie.poster_path}
                      className="rounded-large shadow-xl shadow-black/60 ring-1 ring-white/10"
                      style={{width: "100%", height: "auto"}}
                    />
                    : null
                  }
                </div>
                <div className='w-8/12'>
                  <h1 className='font-marquee text-4xl md:text-5xl text-foreground leading-none'>{movie.movie.title}</h1>

                  {
                    movie.movie.overview !== undefined ?
                    <div>
                      <h3 className='text-foreground/50 mt-3 text-base italic'>{movie.movie.tagline}</h3>
                      <p className='text-foreground/70 mt-3 text-sm flex items-center gap-1.5'>
                        <Icon icon="solar:calendar-linear" height={16} className="text-primary" />
                        {formatDate(movie.showing_datetime)}
                      </p>
                      <p className='text-foreground/70 mt-1 text-sm flex items-center gap-1.5'>
                        <Icon icon="solar:clock-circle-linear" height={16} className="text-primary" />
                        {formatTime(movie.showing_datetime)}
                      </p>
                      <div className='flex flex-wrap gap-2 mt-4'>
                        {
                          movie.movie.genres ?
                            movie.movie.genres.map(genre => (
                              <Chip key={genre.id || genre.name} size="sm" variant="bordered" className='border-white/20 text-foreground/70'>
                                {genre.name}
                              </Chip>
                            ))
                          : null
                        }
                      </div>
                    </div>
                    : null
                  }
                </div>
              </div>

              {
                movie.movie.overview !== undefined ?
                <p className='mt-6 text-foreground/70 text-sm leading-relaxed'>{movie.movie.overview}</p>
                : null
              }

              <img
                className='mt-6 opacity-60'
                style={{maxHeight: 8}}
                alt="TMDB"
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_1-8ba2ac31f354005783fab473602c34c3f4fd207150182061e425d366e4f34596.svg"
              />
            </div>

            {/* Seat selection */}
            <div className='w-full lg:w-6/12 flex justify-center'>
              <Card className='bg-content1/70 backdrop-blur-md border border-white/10 w-fit h-fit'>
                <CardBody className='p-6 items-center'>
                  <h2 className='font-marquee text-3xl text-foreground'>Select Your Seats</h2>
                  {
                    theaterLayout.theaterWidth !== undefined ?
                    <SeatPicker
                      movieData={movie}
                      setSelectedSeats={setSelectedSeats}
                      selectedSeats={selectedSeats}
                      theaterLayout={theaterLayout}
                      seatZindex={10}
                      />
                    : null
                  }
                  {
                    snacks.length > 0 ?
                    <div className='w-full mt-6'>
                      <h3 className='font-marquee text-xl text-foreground mb-3'>Add Snacks</h3>
                      <div className='flex flex-col gap-2 w-full'>
                        {
                          snacks.map(snack => (
                            <div key={snack.snack_id} className='flex items-center gap-3 bg-background/40 border border-white/10 rounded-medium p-2.5'>
                              {
                                snack.image_path ?
                                <img src={snack.image_path} alt={snack.name} className='w-11 h-11 rounded-small object-cover flex-shrink-0' />
                                :
                                <div className='w-11 h-11 rounded-small bg-content2 flex items-center justify-center flex-shrink-0'>
                                  <Icon icon="solar:chef-hat-linear" height={20} className='text-foreground/30' />
                                </div>
                              }
                              <div className='min-w-0 flex-1'>
                                <p className='text-sm font-semibold text-foreground'>{snack.name}{snack.price != null ? <span className='text-foreground/40 font-normal'> · ${snack.price.toFixed(2)}</span> : null}</p>
                                <p className='text-xs text-foreground/50 line-clamp-1'>{snack.description}</p>
                              </div>
                              <div className='flex items-center gap-2 flex-shrink-0'>
                                <Button isIconOnly size='sm' variant='flat' className='min-w-7 w-7 h-7' onClick={() => changeSnackQty(snack.snack_id, -1)}>
                                  <Icon icon="solar:minus-circle-linear" height={16} />
                                </Button>
                                <span className='text-sm font-semibold w-5 text-center'>{snackQty[snack.snack_id] || 0}</span>
                                <Button isIconOnly size='sm' variant='flat' color='primary' className='min-w-7 w-7 h-7' onClick={() => changeSnackQty(snack.snack_id, 1)}>
                                  <Icon icon="solar:add-circle-linear" height={16} />
                                </Button>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      {
                        snackTotal > 0 ?
                        <p className='text-sm text-foreground/60 mt-2 text-right'>Snacks total: <span className='text-foreground font-semibold'>${snackTotal.toFixed(2)}</span></p>
                        : null
                      }
                    </div>
                    : null
                  }
                  <div className='flex items-center justify-between w-full mt-6 gap-4'>
                    <div className='flex flex-wrap gap-1.5 items-center min-h-8'>
                      {
                        selectedSeats.length > 0 ?
                          [...selectedSeats].sort().map(seat => (
                            <Chip key={seat} size='sm' color='primary' variant='flat' className='font-semibold'>{seat}</Chip>
                          ))
                        : <p className='text-foreground/40 text-sm m-0'>No seats selected</p>
                      }
                    </div>
                    <Button
                      className='z-10 font-semibold uppercase tracking-wider px-8 flex-shrink-0'
                      variant="solid"
                      color="primary"
                      radius="full"
                      startContent={<Icon icon="solar:ticket-bold" height={18} />}
                      onClick={checkout}
                      isDisabled={selectedSeats.length === 0}
                    >
                      Complete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
    )
}

export default CheckoutScreen
