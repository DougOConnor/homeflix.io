import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Chip, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Html5Qrcode } from 'html5-qrcode';

import { formatDate, formatTime } from '../../utils/datetime';

const READER_ID = "qr-reader";

const parseTicket = (decodedText) => {
    let data;
    try {
        data = JSON.parse(decodedText);
    } catch (e) {
        return { error: "This QR code is not a Homeflix ticket." };
    }
    if (!data || data.t !== "homeflix-ticket" || !data.showing_id || !Array.isArray(data.seats)) {
        return { error: "This QR code is not a Homeflix ticket." };
    }
    return { ticket: data };
}

const ScanTicketScreen = (props) => {
    const scannerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [seatStatus, setSeatStatus] = useState(null);
    const [checkInStatus, setCheckInStatus] = useState(null);
    const [checkInResults, setCheckInResults] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);

    const getScanner = () => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5Qrcode(READER_ID);
        }
        return scannerRef.current;
    }

    const stopCamera = () => {
        const scanner = scannerRef.current;
        if (scanner && scanner.isScanning) {
            scanner.stop().catch(() => {});
        }
        setCameraActive(false);
    }

    useEffect(() => {
        return () => stopCamera();
    }, []);

    const handleDecoded = (decodedText) => {
        stopCamera();
        const result = parseTicket(decodedText);
        if (result.error) {
            setScanError(result.error);
            setTicket(null);
            setSeatStatus(null);
            return;
        }
        setScanError(null);
        setTicket(result.ticket);
        setSeatStatus(null);
        setCheckInStatus(null);
        setCheckInResults(null);
        // Cross-check the encoded seats against the live reservation list
        axios.get('/api/v1/showings/' + result.ticket.showing_id).then(response => {
            const reserved = response.data.reservations || [];
            const status = {};
            result.ticket.seats.forEach(seat => {
                status[seat] = reserved.indexOf(seat) > -1;
            });
            setSeatStatus(status);
        }).catch(() => {
            setSeatStatus({});
        });
        // Pull live check-in state so a re-used ticket stands out immediately
        axios.get('/api/v1/reservation/check-in/' + result.ticket.showing_id).then(response => {
            const status = {};
            response.data.forEach(row => {
                status[row.seat_id] = row;
            });
            setCheckInStatus(status);
        }).catch(() => {
            setCheckInStatus({});
        });
    }

    const checkIn = () => {
        setCheckingIn(true);
        axios.post('/api/v1/reservation/check-in', {
            showing_id: ticket.showing_id,
            seats: ticket.seats,
        }).then(response => {
            setCheckInResults(response.data.results);
            const status = {...(checkInStatus || {})};
            Object.keys(response.data.results).forEach(seat => {
                const r = response.data.results[seat];
                if (r.status === 'checked_in' || r.status === 'already_checked_in') {
                    status[seat] = {...(status[seat] || {}), checked_in: true, checked_in_at: r.checked_in_at};
                }
            });
            setCheckInStatus(status);
        }).finally(() => setCheckingIn(false));
    }

    const startCamera = () => {
        setScanError(null);
        setCameraError(null);
        setTicket(null);
        const scanner = getScanner();
        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => handleDecoded(decodedText),
            () => {}
        ).then(() => {
            setCameraActive(true);
        }).catch((err) => {
            setCameraError("Could not access a camera. You can scan from an image instead.");
            setCameraActive(false);
        });
    }

    const scanFromFile = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setScanError(null);
        setCameraError(null);
        stopCamera();
        getScanner().scanFile(file, false).then(decodedText => {
            handleDecoded(decodedText);
        }).catch(() => {
            setScanError("No QR code found in that image.");
        });
        e.target.value = null;
    }

    const reset = () => {
        setTicket(null);
        setSeatStatus(null);
        setCheckInStatus(null);
        setCheckInResults(null);
        setScanError(null);
        setCameraError(null);
    }

    const allSeatsValid = seatStatus !== null && ticket !== null &&
        ticket.seats.length > 0 && ticket.seats.every(seat => seatStatus[seat]);

    const alreadyCheckedInSeats = ticket !== null && checkInStatus !== null ?
        ticket.seats.filter(seat => checkInStatus[seat] && checkInStatus[seat].checked_in && !(checkInResults && checkInResults[seat] && checkInResults[seat].status === 'checked_in')) : [];

    const allCheckedIn = ticket !== null && checkInStatus !== null &&
        ticket.seats.every(seat => checkInStatus[seat] && checkInStatus[seat].checked_in);

    return (
        <div className='w-full min-h-screen bg-spotlight flex justify-center'>
            <div className='w-full max-w-2xl px-8 pt-10 pb-16'>
                <h1 className='font-marquee text-4xl text-foreground tracking-wider mb-1'>Scan Ticket</h1>
                <p className='text-foreground/50 text-sm mb-8'>Scan a guest's ticket QR code to check them in.</p>

                {/* Camera viewport — html5-qrcode renders into this div */}
                <div id={READER_ID} className={"overflow-hidden rounded-large " + (cameraActive ? "border border-white/10" : "")} />

                {
                    !ticket ?
                    <Card className='bg-content1/70 border border-white/10 mt-4'>
                        <CardBody className='p-6 items-center text-center'>
                            {
                                !cameraActive ?
                                <Icon icon="solar:qr-code-bold" height={64} className='text-foreground/20 mb-4' />
                                : null
                            }
                            {
                                cameraError ? <p className='text-warning text-sm mb-4'>{cameraError}</p> : null
                            }
                            {
                                scanError ? <p className='text-danger text-sm mb-4'>{scanError}</p> : null
                            }
                            <div className='flex flex-wrap gap-3 justify-center'>
                                {
                                    cameraActive ?
                                    <Button variant='flat' onClick={stopCamera}>
                                        Stop Camera
                                    </Button>
                                    :
                                    <Button
                                        color='primary'
                                        className='font-semibold uppercase tracking-wider'
                                        startContent={<Icon icon="solar:camera-linear" height={18} />}
                                        onClick={startCamera}
                                    >
                                        Start Camera
                                    </Button>
                                }
                                <Button
                                    variant='bordered'
                                    className='border-white/20'
                                    startContent={<Icon icon="solar:gallery-linear" height={18} />}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    Scan From Image
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className='hidden'
                                    onChange={scanFromFile}
                                />
                            </div>
                        </CardBody>
                    </Card>
                    : null
                }

                {
                    ticket ?
                    <Card className='bg-content1/80 border border-white/10 mt-4'>
                        <CardBody className='p-6'>
                            <div className='flex items-center gap-3 mb-6 flex-wrap'>
                                {
                                    seatStatus === null ?
                                    <Chip variant='flat'>Verifying...</Chip>
                                    :
                                    allSeatsValid ?
                                    <Chip color='success' variant='flat' startContent={<Icon icon="solar:check-circle-bold" height={16} />} className='font-semibold'>
                                        Valid Ticket
                                    </Chip>
                                    :
                                    <Chip color='danger' variant='flat' startContent={<Icon icon="solar:close-circle-bold" height={16} />} className='font-semibold'>
                                        Check Seats
                                    </Chip>
                                }
                                {
                                    alreadyCheckedInSeats.length > 0 ?
                                    <Chip color='warning' variant='flat' startContent={<Icon icon="solar:danger-triangle-bold" height={16} />} className='font-semibold'>
                                        Already checked in: {alreadyCheckedInSeats.join(', ')}
                                    </Chip>
                                    : null
                                }
                            </div>

                            <h2 className='font-marquee text-3xl text-foreground'>{ticket.title}</h2>
                            <div className='grid grid-cols-2 gap-4 mt-4'>
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
                                            ticket.seats.map(seat => {
                                                let color = 'default'
                                                if (seatStatus !== null) {
                                                    color = seatStatus[seat] ? 'success' : 'danger'
                                                }
                                                const isCheckedIn = checkInStatus !== null && checkInStatus[seat] && checkInStatus[seat].checked_in
                                                return (
                                                    <Chip
                                                        key={seat}
                                                        size='sm'
                                                        color={color}
                                                        variant='flat'
                                                        className='font-semibold'
                                                        startContent={isCheckedIn ? <Icon icon="solar:check-circle-bold" height={14} /> : null}
                                                    >
                                                        {seat}
                                                    </Chip>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        seatStatus !== null && !allSeatsValid ?
                                        <p className='text-danger text-xs mt-2'>Highlighted seats have no matching reservation.</p>
                                        : null
                                    }
                                </div>
                                <div>
                                    <p className='text-[10px] uppercase tracking-[0.2em] text-foreground/40 mb-1'>Guest</p>
                                    <p className='text-sm text-foreground truncate'>{ticket.email || '—'}</p>
                                </div>
                            </div>

                            <div className='flex justify-end gap-3 mt-6'>
                                <Button
                                    variant='bordered'
                                    className='border-white/20 font-semibold uppercase tracking-wider'
                                    startContent={<Icon icon="solar:qr-code-linear" height={18} />}
                                    onClick={reset}
                                >
                                    Scan Another
                                </Button>
                                {
                                    allCheckedIn ?
                                    <Chip color='success' variant='flat' className='font-semibold h-10 px-4' startContent={<Icon icon="solar:check-circle-bold" height={16} />}>
                                        Checked In
                                    </Chip>
                                    :
                                    <Button
                                        color='primary'
                                        className='font-semibold uppercase tracking-wider'
                                        startContent={<Icon icon="solar:user-check-rounded-linear" height={18} />}
                                        onClick={checkIn}
                                        isLoading={checkingIn}
                                        isDisabled={seatStatus === null || !allSeatsValid}
                                    >
                                        Check In
                                    </Button>
                                }
                            </div>
                        </CardBody>
                    </Card>
                    : null
                }
            </div>
        </div>
    )
}

export default ScanTicketScreen
