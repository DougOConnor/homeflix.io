import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, Input, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const EmailSettingsScreen = (props) => {
    const [settings, setSettings] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);

    useEffect(() => {
        axios.get('/api/v1/settings/email').then(response => {
            setSettings(response.data);
            setLoaded(true);
        }).catch(() => setLoaded(true));
    }, []);

    const set = (key) => (e) => setSettings({...settings, [key]: e.target.value});

    const save = () => {
        setSaving(true);
        axios.post('/api/v1/settings/email', settings).then(() => {
            toast.success('Email settings saved');
        }).finally(() => setSaving(false));
    }

    const sendTest = () => {
        if (!settings.smtp_test_recipient) {
            toast.error('Enter a test recipient first');
            return;
        }
        setTesting(true);
        axios.post('/api/v1/settings/test-email', settings).then(() => {
            toast.success('Test email sent to ' + settings.smtp_test_recipient);
        }).catch(error => {
            const message = error.response && error.response.data && error.response.data.error
                ? error.response.data.error : 'Test email failed';
            toast.error(message);
        }).finally(() => setTesting(false));
    }

    return (
        <div className='w-full min-h-screen bg-spotlight flex justify-center'>
            <div className='w-full max-w-3xl px-8 pt-10 pb-16'>
                <h1 className='font-marquee text-4xl text-foreground tracking-wider mb-1'>Email</h1>
                <p className='text-foreground/50 text-sm mb-8'>Send guests cinema-styled booking confirmations with their ticket QR code.</p>

                {
                    loaded ?
                    <Card className='bg-content1/70 border border-white/10'>
                        <CardHeader className='px-6 pt-5 pb-0 flex justify-between items-center'>
                            <div className='flex gap-3 items-center'>
                                <Icon icon="solar:letter-linear" height={22} className='text-primary' />
                                <p className='font-semibold text-foreground'>SMTP Settings</p>
                            </div>
                            <Switch
                                isSelected={settings.smtp_enabled === true || settings.smtp_enabled === 'true'}
                                onValueChange={(value) => setSettings({...settings, smtp_enabled: value})}
                            >
                                <span className='text-sm text-foreground/60'>{(settings.smtp_enabled === true || settings.smtp_enabled === 'true') ? 'Enabled' : 'Disabled'}</span>
                            </Switch>
                        </CardHeader>
                        <CardBody className='p-6 gap-4'>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                <Input
                                    className='sm:col-span-2'
                                    label='SMTP Server'
                                    placeholder='smtp.example.com'
                                    variant='bordered'
                                    value={settings.smtp_server || ''}
                                    onChange={set('smtp_server')}
                                />
                                <Input
                                    label='Port'
                                    placeholder='587'
                                    type='number'
                                    variant='bordered'
                                    value={settings.smtp_port ? settings.smtp_port.toString() : ''}
                                    onChange={set('smtp_port')}
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <Input
                                    label='Username'
                                    variant='bordered'
                                    value={settings.smtp_username || ''}
                                    onChange={set('smtp_username')}
                                />
                                <Input
                                    label='Password'
                                    type='password'
                                    variant='bordered'
                                    value={settings.smtp_password || ''}
                                    onChange={set('smtp_password')}
                                />
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <Input
                                    label='From Name'
                                    placeholder='Dougflix Theater'
                                    variant='bordered'
                                    value={settings.smtp_from_name || ''}
                                    onChange={set('smtp_from_name')}
                                />
                                <Input
                                    label='From Email'
                                    placeholder='tickets@example.com'
                                    variant='bordered'
                                    value={settings.smtp_from_email || ''}
                                    onChange={set('smtp_from_email')}
                                />
                            </div>
                            <Input
                                label='App URL'
                                description='Used for the "View Your Ticket" links in emails.'
                                placeholder='https://theater.example.com'
                                variant='bordered'
                                value={settings.app_url || ''}
                                onChange={set('app_url')}
                            />
                            <Divider className='bg-white/10' />
                            <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-end'>
                                <Input
                                    label='Test Recipient'
                                    placeholder='you@example.com'
                                    variant='bordered'
                                    className='flex-1'
                                    value={settings.smtp_test_recipient || ''}
                                    onChange={set('smtp_test_recipient')}
                                />
                                <Button
                                    variant='bordered'
                                    className='border-white/20 font-semibold'
                                    startContent={<Icon icon="solar:letter-linear" height={16} />}
                                    onClick={sendTest}
                                    isLoading={testing}
                                >
                                    Send Test Email
                                </Button>
                            </div>
                        </CardBody>
                        <Divider className='bg-white/10' />
                        <CardFooter className='justify-end px-6 py-4'>
                            <Button
                                color='primary'
                                className='font-semibold uppercase tracking-wider'
                                onClick={save}
                                isLoading={saving}
                            >
                                Save
                            </Button>
                        </CardFooter>
                    </Card>
                    : null
                }
            </div>
        </div>
    );
}

export default EmailSettingsScreen;
