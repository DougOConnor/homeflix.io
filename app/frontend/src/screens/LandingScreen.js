
import LoginModal from "../components/LoginModal";
import SignUpModal from "../components/SignupModal";
import { Icon } from '@iconify/react';
import { theaterIcon } from "../utils/branding";

import { useState } from "react";

const LandingScreen = (props) => {
  const [screenMode, setScreenMode] = useState('login');

  const theaterName = props.info && props.info.theater_name ? props.info.theater_name : "Homeflix";

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-spotlight px-4 py-12'>
      <div className='flex flex-col items-center mb-10 text-center'>
        <div className='flex items-center gap-3 mb-2'>
          <Icon icon={theaterIcon(props.info)} className="text-primary" height={40} />
          <h1 className='font-marquee text-5xl md:text-6xl text-foreground text-glow-marquee tracking-wider'>
            {theaterName}
          </h1>
        </div>
        <p className='text-foreground/60 text-sm md:text-base uppercase tracking-[0.3em]'>
          Your seat is waiting
        </p>
      </div>
      <div className='w-full max-w-md'>
        {screenMode === "login" ? <LoginModal login={props.login} setSignupMode={() => setScreenMode('signup')} /> : null}
        {screenMode === "signup" ? <SignUpModal login={props.login} setLoginMode={() => setScreenMode('login')} /> : null}
      </div>
    </div>
  );

};
export default LandingScreen;
