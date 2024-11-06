'use client';
import React, { useEffect, useState } from 'react';
import './WalletReady.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';
import ProgressBar from '../WalletCreation/ProgressBar';
const WalletManagement = process.env.NEXT_PUBLIC_WalletManagement

const WalletReady: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    setLoading(true);
    router.push('/Userauthorization/Dashboard/Home');
  };

  const handleLater = () => {
    setLoading(true);
    router.push('/Userauthorization/Dashboard/Home');
  };

  const handleLeftArrowClick = () => {
    setLoading(true);
    router.push('./WalletSecretCode/success/');
  };

  return (
    <div className='maincontainer'>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '430px', backgroundColor: 'black' }}>
          <LottieAnimationLoading width="300px" height="300px" />
        </div>
      ) : (
        <div className='subcontainer'>
          <div className="container">
            <div className="columnleft" onClick={handleLeftArrowClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8L10 12L14 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div className="columnmiddle">
              <ProgressBar currentStep={3} totalSteps={3} />
            </div>
            <div className="columnright">
              <h1 className='status'>3/3</h1>
            </div>
          </div>
          <div className='bodycontainer'>
            <h1 className='firstheading'>Success!</h1>
            <h1 className='secondheading1'>Your wallet is ready</h1>
            <h1 className='secondheading'>Join and claim your free username.</h1>
            <svg className='svg1' width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_348_4431)">
                <path d="M66.3798 52.5001C65.5518 52.5041 64.8838 53.1761 64.8838 54.0041C64.8838 54.8321 65.5558 55.5041 66.3838 55.5001C67.2118 55.5001 67.8838 54.8281 67.8838 54.0001C67.8838 53.1721 67.2118 52.5001 66.3798 52.5001" stroke="url(#paint0_linear_348_4431)" stroke-width="3.625" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12.001 19.9999V73.9999C12.001 78.4199 15.581 81.9999 20.001 81.9999H76.001C80.421 81.9999 84.001 78.4199 84.001 73.9999V33.9999C84.001 29.5799 80.421 25.9999 76.001 25.9999H18.001C14.689 25.9999 12.001 23.3119 12.001 19.9999V19.9999C12.001 16.6879 14.689 13.9999 18.001 13.9999H68.001" stroke="url(#paint1_linear_348_4431)" stroke-width="3.625" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <linearGradient id="paint0_linear_348_4431" x1="64.3838" y1="52.0001" x2="68.4696" y2="52.0897" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#45F0D1" />
                  <stop offset="1" stop-color="#76E268" />
                </linearGradient>
                <linearGradient id="paint1_linear_348_4431" x1="12.001" y1="13.9999" x2="85.5415" y2="15.7089" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#45F0D1" />
                  <stop offset="1" stop-color="#76E268" />
                </linearGradient>
                <clipPath id="clip0_348_4431">
                  <rect width="96" height="96" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </div>
          <button className="claim-button" onClick={handleClaim}>Claim for free</button>
        </div>
      )
      }
    </div >
  );
}

export default WalletReady;
