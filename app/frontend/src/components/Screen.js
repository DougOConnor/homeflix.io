import ApiClient from '../ApiClient';
import {
    useEffect
} from 'react';

export default function Screen(props) {

    

    useEffect(() => {
        ApiClient.get('/api/v1/user').catch((error) => {
            console.log(error);
        });
    }, []);


  return (
    <div className='h-lvh overflow-y-scroll'>
        {props.children}
    </div>
  );
}
