"use client"; 
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Change to useSearchParams
import styles from './Successpage.module.css'; 

const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams(); // Get search parameters
  const fiat_wallet_address = searchParams.get('fiat_wallet_address'); // Get wallet_id from query

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard/Home'; // Change to window.location.href for redirection
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.successContainer}>
        {/* Success Message */}
        <h3 className={styles.successMessage}>Wallet created Successfully!</h3>
        
        {/* Wallet Icon */}
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.walletIcon}>
          <g clipPath="url(#clip0_1532_9597)">
            <path d="M66.3798 52.4995C65.5518 52.5035 64.8838 53.1755 64.8838 54.0035C64.8838 54.8315 65.5558 55.5035 66.3838 55.4995C67.2118 55.4995 67.8838 54.8275 67.8838 53.9995C67.8838 53.1715 67.2118 52.4995 66.3798 52.4995" stroke="url(#paint0_linear_1532_9597)" strokeWidth="3.625" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.001 19.9995V73.9995C12.001 78.4195 15.581 81.9995 20.001 81.9995H76.001C80.421 81.9995 84.001 78.4195 84.001 73.9995V33.9995C84.001 29.5795 80.421 25.9995 76.001 25.9995H18.001C14.689 25.9995 12.001 23.3115 12.001 19.9995V19.9995C12.001 16.6875 14.689 13.9995 18.001 13.9995H68.001" stroke="url(#paint1_linear_1532_9597)" strokeWidth="3.625" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_1532_9597" x1="64.3838" y1="51.9995" x2="68.4696" y2="52.0892" gradientUnits="userSpaceOnUse">
              <stop stopColor="#45F0D1"/>
              <stop offset="1" stopColor="#76E268"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1532_9597" x1="12.001" y1="13.9995" x2="85.5415" y2="15.7085" gradientUnits="userSpaceOnUse">
              <stop stopColor="#45F0D1"/>
              <stop offset="1" stopColor="#76E268"/>
            </linearGradient>
            <clipPath id="clip0_1532_9597">
              <rect width="96" height="96" fill="white"/>
            </clipPath>
          </defs>
        </svg>

        {/* Transaction Complete Message */}
        <div className={styles.transactionComplete}>
          <div className={styles.checkIconContainer}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="20.0004" cy="20.0004" rx="15.0062" ry="15.0062" stroke="#76E268" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.0713 20.5653L17.6845 24.1785L17.6611 24.1551L25.8128 16.0034" stroke="#76E268" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="textContainer">
          {fiat_wallet_address && <p>Wallet Address: {fiat_wallet_address}</p>}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
