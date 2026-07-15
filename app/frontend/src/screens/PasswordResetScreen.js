
import PasswordResetModal from "../components/PasswordResetModal";
import { Icon } from '@iconify/react';
import { theaterIcon } from "../utils/branding";

import {
    useSearchParams
} from "react-router-dom";

const PasswordResetScreen = (props) => {
  const [searchParams] = useSearchParams();

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
          Reset your password
        </p>
      </div>
      <div className='w-full max-w-md'>
        <PasswordResetModal email={searchParams.get("email")} token={searchParams.get("token")} />
      </div>
    </div>
  );

};
export default PasswordResetScreen;
