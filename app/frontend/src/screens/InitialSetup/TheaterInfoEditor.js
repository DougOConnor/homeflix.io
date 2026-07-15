import React, {useState} from 'react';
import axios from 'axios'
import { Button, Card, CardBody, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

import { useNavigate } from 'react-router-dom';


const TheaterInfoEditor = (props) => {
    const [theaterName, setTheaterName] = useState()
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    const saveInfo = () => {
        setSaving(true)
        axios.post(
            "/api/v1/settings/info",
            {
                theater_name: theaterName,
                first_time_settings_complete: "true"
            }
        ).then(() => {
            if (props.refreshInfo) {
                props.refreshInfo()
            }
            navigate("/setup/layout")
        }).finally(() => setSaving(false))
    }

    const theaterNameChangeHandler = (e) => {
        setTheaterName(e.target.value)
    }


    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-spotlight px-4 py-12'>
        <div className='flex flex-col items-center mb-10 text-center'>
          <Icon icon="solar:clapperboard-play-bold" className="text-primary mb-3" height={44} />
          <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
            Welcome to Homeflix
          </h1>
          <p className='text-foreground/50 text-xs uppercase tracking-[0.3em] mt-2'>Step 2 of 3 — Name your theater</p>
        </div>

        <Card className='w-full max-w-lg bg-content1/70 backdrop-blur-md border border-white/10 shadow-marquee'>
          <CardBody className='p-8'>
            <p className='text-foreground/70 text-sm mb-6'>
              What's your theater called? This name goes up on the marquee — guests will see it on every page.
            </p>
            <Input
                id="theater-name-input"
                label="Theater Name"
                placeholder="e.g. The Basement Bijou"
                variant="bordered"
                size="lg"
                autoFocus
                startContent={<Icon icon="solar:home-smile-linear" height={20} className='text-default-400' />}
                onChange={(name) => theaterNameChangeHandler(name)}
            />
            <div className='flex justify-end mt-8'>
              <Button
                id="save-theater-info"
                color='primary'
                className='font-semibold uppercase tracking-wider px-8'
                endContent={<Icon icon="solar:alt-arrow-right-linear" height={16} />}
                onClick={() => saveInfo()}
                isLoading={saving}
              >
                Continue
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
}

export default TheaterInfoEditor
