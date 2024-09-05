'use client';
import React, { useState, useEffect } from 'react';
import './WalletManager.css';
import ProgressBar from './ProgressBar';
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const WalletManager: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Added delay for demonstration, adjust as needed
    return () => clearTimeout(timer);
  }, []);

  const handleCreateNewWallet = () => {
    setLoading(true);
    window.location.href = './WalletCreation/CreateAccount';
  };

  const handleExistingWallet = () => {
    setLoading(true);
    window.location.href = './WalletCreation/AddAccount';
  };

  return (
    <div className="wallet-manager">
      {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          {/* <div className='loadingText'>LOADING</div> */}
        </div>
      ) : (
        <div className='card'>
          <div className="container">
            <div className="column left" onClick={() => window.history.back()}>
              <FaArrowLeft />
            </div>
            <div className="column middle">
              <ProgressBar currentStep={1} totalSteps={4} />
            </div>
            <div className="column right">
            </div>
          </div>
          <div className="wallet-icon">
            <img src='https://res.cloudinary.com/dgfv6j82t/image/upload/v1724914705/Dupay-Black_kai1eq.png' alt="DeFi Icon" />
          </div>
          <h1 className="header1">Manage your DeFi</h1>
          <button onClick={handleCreateNewWallet} className="create-wallet-button">
            Create new wallet
          </button>
          <button onClick={handleExistingWallet} className="existing-wallet-button">
            I already have a wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
