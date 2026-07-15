import React, {useState} from 'react';
import axios from 'axios';
import { Button, Card, CardBody, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';


const AdminCreate = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const createAdmin = async () => {
        const problems = [];
        if (!email.trim()) problems.push('Email is required');
        if (!password) problems.push('Password is required');
        if (password !== confirmPassword) problems.push('Passwords do not match');
        setErrors(problems);
        if (problems.length > 0) return;

        setSaving(true);
        try {
            await axios.post('/api/v1/auth/signup', { email: email.trim(), password: password });
            // Sign straight in so the rest of setup (and the admin panel) works
            await axios.post('/api/v1/auth/login', { email: email.trim(), password: password });
            if (props.onLogin) props.onLogin();
            navigate('/setup/info');
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.error
                ? error.response.data.error : 'Could not create the account. Please try again.';
            setErrors([message]);
        } finally {
            setSaving(false);
        }
    }

    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-spotlight px-4 py-12'>
        <div className='flex flex-col items-center mb-10 text-center'>
          <Icon icon="solar:clapperboard-play-bold" className="text-primary mb-3" height={44} />
          <h1 className='font-marquee text-4xl md:text-5xl text-foreground text-glow-marquee tracking-wider'>
            Welcome to Homeflix
          </h1>
          <p className='text-foreground/50 text-xs uppercase tracking-[0.3em] mt-2'>Step 1 of 3 — Create your admin account</p>
        </div>

        <Card className='w-full max-w-lg bg-content1/70 backdrop-blur-md border border-white/10 shadow-marquee'>
          <CardBody className='p-8'>
            <p className='text-foreground/70 text-sm mb-6'>
              This account runs the show — it manages showings, snacks, and settings.
            </p>
            <form className='flex flex-col gap-4' onSubmit={(e) => { e.preventDefault(); createAdmin(); }}>
              <Input
                id="admin-email-input"
                autoFocus
                label="Email"
                type="email"
                variant="bordered"
                startContent={<Icon icon="solar:letter-linear" height={20} className='text-default-400' />}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="admin-password-input"
                label="Password"
                type="password"
                variant="bordered"
                startContent={<Icon icon="solar:lock-keyhole-linear" height={20} className='text-default-400' />}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="admin-confirm-password-input"
                label="Confirm Password"
                type="password"
                variant="bordered"
                startContent={<Icon icon="solar:lock-keyhole-linear" height={20} className='text-default-400' />}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {
                errors.length > 0 ?
                <div className='bg-danger/15 text-danger p-3 rounded-medium text-sm'>
                  {errors.map((err, i) => <p key={i}>{err}</p>)}
                </div>
                : null
              }
              <div className='flex justify-end mt-2'>
                <Button
                  id="create-admin-account-button"
                  type="submit"
                  color='primary'
                  className='font-semibold uppercase tracking-wider px-8'
                  endContent={<Icon icon="solar:alt-arrow-right-linear" height={16} />}
                  isLoading={saving}
                >
                  Continue
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    )
}

export default AdminCreate
