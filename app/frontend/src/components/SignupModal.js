import React from "react";
import {useState} from "react";
import {Button, Input, Card, CardBody} from "@heroui/react";
import ApiClient from '../ApiClient';
import { Icon } from '@iconify/react';


export default function SignUpModal(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [validationErrors, setValidationErrors] = useState([]);
    const [showValidationErrors, setShowValidationErrors] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    const [loginActivity, setLoginActivity] = useState(false);

    const signUp = () => {
      setLoginActivity(true);
      ApiClient.post('/api/v1/auth/signup', {
        email: email,
        password: password
      }).then((response) => {
        setShowWelcome(true);
      }).catch((error) => {
        console.log(error);
        setShowValidationErrors(true);
        setValidationErrors([error.response.data.error]);
      }).finally(() => {
        setLoginActivity(false);
      });
    }

    const validate = () => {
      let errors = [];
      if (email === '') {
        errors.push('Email is required');
      }
      if (password === '') {
        errors.push('Password is required');
      }
      if (password2 === '') {
        errors.push('Re-enter password is required');
      }
      if (password !== password2) {
        errors.push('Passwords do not match');
      }
      setValidationErrors(errors);
      if (errors.length === 0) {
        setShowValidationErrors(false);
        return true;
      } else {
        setShowValidationErrors(true);
        return false;
      }
    }

    const validatedSignup = () => {
      if (validate()) {
        signUp();
      }
    }


  return (
    <Card className="w-full bg-content1/70 backdrop-blur-md border border-white/10 shadow-marquee">
      {
        showWelcome ? (
          <CardBody className="p-8 items-center text-center">
            <Icon icon="solar:ticket-bold" className="text-primary mb-4" height={48} />
            <h2 className="font-marquee text-3xl text-foreground mb-2">You're In!</h2>
            <p className="text-foreground/60">
              Thank you for signing up. Please{' '}
              <span onClick={props.setLoginMode} className="cursor-pointer text-primary hover:underline">sign in</span>{' '}
              to get started.
            </p>
          </CardBody>
        ) : (
          <CardBody className="p-8">
            <h2 className="font-marquee text-3xl text-foreground mb-1">Sign Up</h2>
            <p className="text-foreground/50 text-sm mb-6">Grab a seat — create your account.</p>
            <form
              className="flex flex-col"
              onSubmit={(e) => { e.preventDefault(); validatedSignup(); }}
            >
              <Input
                autoFocus
                startContent={
                  <Icon icon="solar:letter-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                placeholder="Enter your email"
                type="email"
                variant="bordered"
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4"
              />
              <Input
                startContent={
                  <Icon icon="solar:lock-keyhole-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
              />
              <Input
                startContent={
                  <Icon icon="solar:lock-keyhole-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Re-enter Password"
                placeholder="Enter your password again"
                type="password"
                variant="bordered"
                onChange={(e) => setPassword2(e.target.value)}
                className="mb-2"
              />
              {
                showValidationErrors ? (
                  <div className="bg-danger/15 text-danger p-3 rounded-medium my-2 text-sm">
                    {
                      validationErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                      ))
                    }
                  </div>
                ) : null
              }
              <Button
                type="submit"
                color="primary"
                className="font-semibold uppercase tracking-wider mt-4"
                isLoading={loginActivity}
              >
                Sign Up
              </Button>
            </form>
            <p className="text-center mt-8 text-sm text-foreground/60">
              Already have an account?{' '}
              <span onClick={props.setLoginMode} className="cursor-pointer text-primary hover:underline">Sign in</span> here.
            </p>
          </CardBody>
        )
      }
    </Card>
  );
}
