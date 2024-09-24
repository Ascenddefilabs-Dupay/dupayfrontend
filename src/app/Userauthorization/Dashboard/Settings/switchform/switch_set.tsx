'use client';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../switchform/switch_formset.css';

const Switch = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserId( storedUserId);
            console.log(storedUserId);
            console.log(sessionData.user_email);
          } else {
            // redirect('http://localhost:3000/Userauthentication/SignIn');
          }
        }
      }, []);
    const switchhandleBackClick = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
    };

    return (
        <div className='switch_card'>
            <ArrowBackIcon 
                className="switch_back_icon" 
                onClick={switchhandleBackClick} // Corrected event handler
            />
            <div className='switch_card1'>
                <img src="/image_cat.jpg" className="switch_image" />
            </div>
            <div className='switch_card2'>
                <label className="center-label">Switch on Simple mode</label>
            </div>
            <div className='switch_card3'>
                <label className="center-label1">This makes it easy for you to hold USD and send money to your friends</label>
            </div>
            <div className='switch_card4'>
                <button className='switchs_now'>
                    <span className='switch_now'>Switch Now</span>
                </button>
                <button className='may_later'>
                    <span className='maybe'>Maybe later</span>
                </button>
            </div>
        </div>
 
    );
};

export default Switch;