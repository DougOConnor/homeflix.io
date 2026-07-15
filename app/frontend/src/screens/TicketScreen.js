import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Chip, Skeleton, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';

import { formatDate, formatTime } from '../utils/datetime';

export const encodeTicket = (ticket) => {
  return JSON.stringify({
    t: "homeflix-ticket",
    showing_id: ticket.showing_id,
    title: ticket.title,
    showing_datetime: ticket.showing_datetime,
    seats: ticket.seats,
    email: ticket.email,
  });
}

const TicketScreen = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [seatsToCancel, setSeatsToCancel] = useState([]);
    const [cancelling, setCancelling] = useState(false);

    const fetchTicket = () => {
        axios.get('/api/v1/reservation/mine').then(response => {
            const match = response.data.find(t => t.showing_id.toString() === params.id.toString());
            setTicket(match || null);
            setLoaded(true);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                // Not signed in — go log in, then come straight back here
                navigate('/login?redirect=' + encodeURIComponent('/my-tickets/' + params.id), { replace: true });
                return;
            }
            setLoaded(true);
        });
    }

    useEffect(() => {
        fetchTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleCancelSeat = (seat) => {
        setSeatsToCancel(prev =>
            prev.indexOf(seat) > -1 ? prev.filter(s => s !== seat) : [...prev, seat]
        );
    }

    const confirmCancel = async () => {
        setCancelling(true);
        try {
            for (const seat of seatsToCancel) {
                await axios.delete('/api/v1/reservation/' + ticket.showing_id + '/' + seat);
            }
            const cancelledAll = seatsToCancel.length === ticket.seats.length;
            toast.success(cancelledAll ? 'Booking cancelled' : 'Seats cancelled: ' + seatsToCancel.join(', '));
            setCancelOpen(false);
            setSeatsToCancel([]);
            if (cancelledAll) {
                navigate('/my-tickets');
            } else {
                fetchTicket();
            }
        } catch (e) {
            toast.error('Could not cancel those seats. Please try again.');
        } finally {
            setCancelling(false);
        }
    }

    const snackTotal = ticket && ticket.snacks ?
        ticket.snacks.reduce((sum, item) => sum + ((item.price || 0) * item.qty), 0) : 0;

    return (
        <div className='flex flex-col items-center bg-spotlight min-h-screen pb-24 px-4'>
          <div className='w-full max-w-md'>
            <Button
              variant="light"
              size="sm"
              className="self-start mt-6 mb-2 text-foreground/60"
              startContent={<Icon icon="solar:alt-arrow-left-linear" height={16} />}
              onClick={() => navigate("/my-tickets")}
            >
              My Tickets
            </Button>

            {
              !loaded ? <Skeleton className='w-full h-[560px] rounded-large mt-2' /> : null
            }

            {
              loaded && !ticket ?
              <div className='flex flex-col items-center text-center mt-24'>
                <Icon icon="solar:ticket-linear" height={64} className="text-foreground/20 mb-4" />
                <p className='font-marquee text-2xl text-foreground/60'>Ticket not found</p>
                <p className='text-foreground/40 mt-1'>This ticket doesn't exist or belongs to another account.</p>
              </div>
              : null
            }

            {
              loaded && ticket ?
              <>
              <Card className='bg-content1/90 border border-white/10 overflow-hidden mt-2'>
                {/* Movie art header */}
                <div className='relative h-40'>
                  {
                    ticket.backdrop_path ?
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-50"
                      style={{backgroundImage: `url(https://image.tmdb.org/t/p/w780${ticket.backdrop_path})`}}
                    /> : <div className='absolute inset-0 bg-content2' />
                  }
                  <div className='absolute inset-0 bg-gradient-to-t from-content1 to-transparent' />
                  <div className='absolute bottom-0 left-0 right-0 px-6 pb-2 flex items-end gap-4'>
                    <img
                      src={ticket.poster_path ? "https://image.tmdb.org/t/p/w185/" + ticket.poster_path : "/tmdb/blank-poster.png"}
                      alt={ticket.title}
                      className='w-20 rounded-medium ring-1 ring-white/20 shadow-xl shadow-black/60 -mb-8 relative z-10'
                    />
                    <h1 className='font-marquee text-3xl text-foreground leading-none pb-1 truncate'>{ticket.title}</h1>
                  </div>
                </div>

                <div className='px-6 pt-12 pb-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1'>Date</p>
                      <p className='text-sm text-foreground'>{formatDate(ticket.showing_datetime)}</p>
                    </div>
                    <div>
                      <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1'>Time</p>
                      <p className='text-sm text-foreground'>{formatTime(ticket.showing_datetime)}</p>
                    </div>
                    <div>
                      <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1'>Seats</p>
                      <div className='flex flex-wrap gap-1.5'>
                        {
                          ticket.seats.map(seat => (
                            <Chip key={seat} size='sm' color='primary' variant='flat' className='font-semibold'>{seat}</Chip>
                          ))
                        }
                      </div>
                    </div>
                    <div>
                      <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1'>Guest</p>
                      <p className='text-sm text-foreground truncate'>{ticket.email}</p>
                    </div>
                  </div>

                  {
                    ticket.snacks && ticket.snacks.length > 0 ?
                    <div className='mt-5'>
                      <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-2'>Snacks</p>
                      <div className='flex flex-col gap-1'>
                        {
                          ticket.snacks.map((item, index) => (
                            <div key={index} className='flex justify-between text-sm text-foreground/80'>
                              <span>{item.qty} × {item.name}</span>
                              {
                                item.price != null ?
                                <span className='text-foreground/50'>${(item.price * item.qty).toFixed(2)}</span>
                                : null
                              }
                            </div>
                          ))
                        }
                        {
                          snackTotal > 0 ?
                          <div className='flex justify-between text-sm font-semibold text-foreground border-t border-white/10 pt-1 mt-1'>
                            <span>Total</span>
                            <span>${snackTotal.toFixed(2)}</span>
                          </div>
                          : null
                        }
                      </div>
                    </div>
                    : null
                  }

                  {/* Perforation between stub and QR */}
                  <div className='relative my-6'>
                    <div className='border-t-2 border-dashed border-white/15' />
                    <div className='absolute -left-9 -top-3 w-6 h-6 rounded-full bg-background' />
                    <div className='absolute -right-9 -top-3 w-6 h-6 rounded-full bg-background' />
                  </div>

                  <div className='flex flex-col items-center'>
                    <div className='bg-white p-4 rounded-large'>
                      <QRCode
                        value={encodeTicket(ticket)}
                        size={208}
                        level="M"
                      />
                    </div>
                    <p className='text-foreground/40 text-xs uppercase tracking-[0.25em] mt-4'>
                      Present at the door
                    </p>
                  </div>
                </div>
              </Card>

              <div className='flex justify-center mt-4'>
                <Button
                  variant='light'
                  color='danger'
                  size='sm'
                  startContent={<Icon icon="solar:trash-bin-trash-linear" height={16} />}
                  onClick={() => { setSeatsToCancel([]); setCancelOpen(true); }}
                >
                  Cancel seats
                </Button>
              </div>

              <Modal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} classNames={{base: "bg-content1 border border-white/10"}}>
                <ModalContent>
                  <ModalHeader className='flex flex-col gap-1'>
                    <span className='font-marquee text-2xl tracking-wide'>Cancel Seats</span>
                    <span className='text-sm font-normal text-foreground/50'>{ticket.title}</span>
                  </ModalHeader>
                  <ModalBody>
                    <p className='text-sm text-foreground/60'>Select the seats you'd like to cancel:</p>
                    <div className='flex flex-wrap gap-2'>
                      {
                        ticket.seats.map(seat => {
                          const selected = seatsToCancel.indexOf(seat) > -1;
                          return (
                            <Chip
                              key={seat}
                              color={selected ? 'danger' : 'default'}
                              variant={selected ? 'solid' : 'bordered'}
                              className='cursor-pointer font-semibold'
                              onClick={() => toggleCancelSeat(seat)}
                            >
                              {seat}
                            </Chip>
                          )
                        })
                      }
                    </div>
                    {
                      seatsToCancel.length > 0 ?
                      <p className='text-danger text-sm'>
                        {seatsToCancel.length === ticket.seats.length
                          ? 'This will cancel your entire booking.'
                          : 'Cancelling: ' + [...seatsToCancel].sort().join(', ')}
                      </p>
                      : null
                    }
                  </ModalBody>
                  <ModalFooter>
                    <Button variant='light' onClick={() => setCancelOpen(false)} isDisabled={cancelling}>
                      Keep My Seats
                    </Button>
                    <Button
                      color='danger'
                      onClick={confirmCancel}
                      isDisabled={seatsToCancel.length === 0}
                      isLoading={cancelling}
                    >
                      Cancel {seatsToCancel.length > 0 ? seatsToCancel.length : ''} Seat{seatsToCancel.length === 1 ? '' : 's'}
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              </>
              : null
            }
          </div>
        </div>
    )
}

export default TicketScreen
