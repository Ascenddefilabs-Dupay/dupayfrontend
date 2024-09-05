'use client';

import React, { useEffect, useState } from 'react';
import './WalletReady.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';


const WalletReady: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        // console.log(storedUserId);
        // console.log(sessionData.user_email);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Adjusted timeout duration if needed
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    setLoading(true);
    window.location.href = '/Userauthorization/Dashboard';
  };

  const handleLater = () => {
    setLoading(true);
    window.location.href = '/Userauthorization/Dashboard';
  };

  const handleLeftArrowClick = () => {
    setLoading(true);
    window.location.href = './WalletSecretCode/success/';
  };

  return (
    <div className="wallet-container">
      {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          {/* <p className='loadingText'>LOADING</p> */}
        </div>
      ) : (
        <div className='card'>
          <div className="wallet-content">
            <div className="container">
              <div className="column left" onClick={handleLeftArrowClick}>
                <FaArrowLeft />
              </div>
              <div className="column middle">
                {/* Middle column content */}
              </div>
              <div className="column right">
                {/* Right column content */}
              </div>
            </div>
            <div className="checkmark">✔️</div>
            <h1 className='header'>Your wallet is Ready</h1>
            <p className='para'>Join and claim your<br /> free username.</p>
            <button className="claim-button" onClick={handleClaim}>Claim for free</button>
            <button className="later-button" onClick={handleLater}>I'll do it later</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletReady;
