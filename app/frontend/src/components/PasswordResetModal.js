import React from "react";
import {useState} from "react";
import {Button, Input, Card, CardBody} from "@heroui/react";
import axios from 'axios';
import { Icon } from '@iconify/react';

export default function PasswordResetModal(props) {
    const [password, setPassword] = useState('');
    const [resetActivity, setResetActivity] = useState(false);
    const [showError, setShowError] = useState(false);

    const reset = () => {
        setResetActivity(true);
        setShowError(false);
        axios.post('/api/v1/auth/reset-password/' + props.email, { token: props.token, password: password }).then((response) => {
            axios.post('/api/v1/auth/login', {
                email: props.email,
                password: password
            }).then((response) => {
                window.location.replace("/");
            }).catch((error) => {
                console.log(error);
                setShowError(true);
                setResetActivity(false);
            });
        }).catch((error) => {
            console.log(error);
            setShowError(true);
            setResetActivity(false);
        });
    };


  return (
    <Card className="w-full bg-content1/70 backdrop-blur-md border border-white/10 shadow-marquee">
      <CardBody className="p-8">
        <h2 className="font-marquee text-3xl text-foreground mb-1">New Password</h2>
        <p className="text-foreground/50 text-sm mb-6">Choose a new password for your account.</p>
        <form
          className="flex flex-col"
          onSubmit={(e) => { e.preventDefault(); reset(); }}
        >
          <Input
            startContent={
              <Icon icon="solar:letter-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Email"
            isDisabled
            variant="bordered"
            value={props.email || ''}
            className="mb-4"
          />
          <Input
            autoFocus
            startContent={
              <Icon icon="solar:lock-keyhole-linear" className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            label="Password"
            placeholder="Enter your new password"
            type="password"
            variant="bordered"
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6"
          />
          <Button
            type="submit"
            color="primary"
            className="font-semibold uppercase tracking-wider"
            isLoading={resetActivity}
          >
            Reset Password
          </Button>
        </form>
        {
          showError ? (
            <p className="text-danger mt-4 text-center text-sm">
              Something went wrong resetting your password. The link may have expired.
            </p>
          ) : null
        }
      </CardBody>
    </Card>
  );
}
