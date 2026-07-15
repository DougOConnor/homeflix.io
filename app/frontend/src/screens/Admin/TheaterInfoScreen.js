import React, {useEffect, useState} from 'react';

import axios from 'axios'
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

import { THEATER_ICONS, theaterIcon } from '../../utils/branding';


const TheaterInfoScreen = (props) => {
    const [info, setInfo] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        axios.get(
          '/api/v1/settings/info'
        ).then(response => {
          setInfo(response.data)
        })
      }, [])

    const updateInfo = () => {
        setSaving(true)
        axios.post(
            '/api/v1/settings/info',
            info
        ).then(response => {
            if (props.refreshInfo) {
                props.refreshInfo()
            }
            toast.success('Theater info saved')
        }).finally(() => setSaving(false))
    }

    const theaterNameChangeHandler = (e) => {
        setInfo({...info, theater_name : e.target.value})
    }

    const selectedIcon = theaterIcon(info)

    return (
        <div className='w-full min-h-screen bg-spotlight flex justify-center'>
            <div className='w-full max-w-3xl px-8 pt-10 pb-16'>
                <h1 className='font-marquee text-4xl text-foreground tracking-wider mb-1'>Theater Info</h1>
                <p className='text-foreground/50 text-sm mb-8'>Settings for how your theater appears to guests.</p>

                <Card className='bg-content1/70 border border-white/10'>
                    <CardHeader className='px-6 pt-5 pb-0 flex gap-3'>
                        <Icon icon="solar:home-smile-linear" height={22} className='text-primary' />
                        <p className='font-semibold text-foreground'>General</p>
                    </CardHeader>
                    <CardBody className='p-6 gap-6'>
                        <Input
                            label="Theater Name"
                            description="Shown in the navbar and on the login screen."
                            variant="bordered"
                            onChange={theaterNameChangeHandler}
                            value={info.theater_name || ''}
                        />

                        <div>
                            <p className='text-sm font-semibold text-foreground/70 mb-1'>Logo Icon</p>
                            <p className='text-xs text-foreground/40 mb-3'>Appears next to your theater name across the app.</p>
                            <div className='grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2'>
                                {
                                    THEATER_ICONS.map(icon => {
                                        const isSelected = selectedIcon === icon
                                        return (
                                            <button
                                                key={icon}
                                                type="button"
                                                aria-label={icon}
                                                onClick={() => setInfo({...info, theater_icon: icon})}
                                                className={
                                                    "flex items-center justify-center rounded-medium aspect-square border transition-all " +
                                                    (isSelected
                                                        ? "border-primary bg-primary/15 text-primary shadow-marquee"
                                                        : "border-white/10 text-foreground/50 hover:text-foreground hover:border-white/30")
                                                }
                                            >
                                                <Icon icon={icon} height={24} />
                                            </button>
                                        )
                                    })
                                }
                            </div>
                            <div className='flex items-center gap-3 mt-5 p-4 rounded-medium bg-background/60 border border-white/10'>
                                <Icon icon={selectedIcon} className='text-primary' height={26} />
                                <span className='font-marquee text-2xl text-foreground tracking-wider'>
                                    {info.theater_name || 'Your Theater'}
                                </span>
                                <span className='text-xs text-foreground/30 ml-auto uppercase tracking-widest'>Preview</span>
                            </div>
                        </div>
                    </CardBody>
                    <Divider className='bg-white/10' />
                    <CardFooter className='justify-end px-6 py-4'>
                        <Button
                            color='primary'
                            className='font-semibold uppercase tracking-wider'
                            onClick={updateInfo}
                            isLoading={saving}
                        >
                            Save
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default TheaterInfoScreen
