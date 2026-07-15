import React from "react";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {writeUserData} from '../utils/auth';
import {Button, Input, Card, CardBody} from "@heroui/react";
import ApiClient from '../ApiClient';
import { Icon } from '@iconify/react';


export default function LoginModal(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginActivity, setLoginActivity] = useState(false);
    const [showPasswordResetMessage, setShowPasswordResetMessage] = useState(false);
    const [showLoginError, setShowLoginError] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState([]);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const login = () => {
      setLoginActivity(true);
      ApiClient.post('/api/v1/auth/login', {
        email: email,
        password: password
      }).then((response) => {
        writeUserData(response.data);
        props.login();
        // Return to wherever the user was headed (in-app paths only)
        const redirect = searchParams.get('redirect');
        if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
          navigate(redirect);
        } else {
          navigate('/');
        }
      }).catch((error) => {
        setShowLoginError(true);
        setLoginErrorMessage([error.response.data.error]);
      }).finally(() => {
        setLoginActivity(false);
      });
    }

    const resetPassword = () => {
      ApiClient.post('/api/v1/auth/reset-password', {
        email: email
      }).then((response) => {
        setShowPasswordResetMessage(true);
      }).catch((error) => {
        console.log(error);
      });
    }

  return (
    <Card className="w-full bg-content1/70 backdrop-blur-md border border-white/10 shadow-marquee">
      <CardBody className="p-8">
        <h2 className="font-marquee text-3xl text-foreground mb-1">Sign In</h2>
        <p className="text-foreground/50 text-sm mb-6">Welcome back to the theater.</p>
        <form
          className="flex flex-col"
          onSubmit={(e) => { e.preventDefault(); login(); }}
        >
          <Input
            className="mb-4"
            autoFocus
            startContent={
              <Icon icon="solar:letter-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className="mb-2"
            startContent={
              <Icon icon="solar:lock-keyhole-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              <button type="button" className="focus:outline-none" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon
                  icon={isPasswordVisible ? "solar:eye-closed-linear" : "solar:eye-linear"}
                  className="text-xl text-default-400"
                />
              </button>
            }
            label="Password"
            placeholder="Enter your password"
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="cursor-pointer mb-6 text-foreground/50 hover:text-primary transition-colors ml-1 text-sm" onClick={() => resetPassword()}>
            Forgot password?
          </p>
          <Button
            type="submit"
            color="primary"
            className="font-semibold uppercase tracking-wider"
            isLoading={loginActivity}
          >
            Sign In
          </Button>
        </form>
        <p className="text-center mt-8 text-sm text-foreground/60">
          Don't have an account yet?{' '}
          <span onClick={props.setSignupMode} className="cursor-pointer text-primary hover:underline">Sign up</span> here.
        </p>
        {
          showPasswordResetMessage ? <p className="text-primary mt-4 text-center text-sm">Password reset email sent.</p> : null
        }
        {
          showLoginError ? (
            <div className="bg-danger/15 text-danger p-3 rounded-medium mt-4 text-sm">
              {
                loginErrorMessage.map((error, index) => (
                  <p key={index}>{error}</p>
                ))
              }
            </div>
          ) : null
        }
      </CardBody>
    </Card>
  );
}
