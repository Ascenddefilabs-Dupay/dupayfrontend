import React from 'react';
import './WalletManager.css';
import ProgressBar from './ProgressBar';
import { FaArrowLeft } from "react-icons/fa";

const WalletManager = () => {

  const handleCreateNewWallet = () => {
    window.location.href = './WalletCreation/CreateAccount';
  };

  const handleExistingWallet = () => {
    window.location.href = './WalletCreation/AddAccount';
  }; 

  return (
    <div className="wallet-manager">
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
    </div>
  );
};

export default WalletManager;