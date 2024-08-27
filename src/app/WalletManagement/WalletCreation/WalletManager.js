import React from 'react';
import './WalletManager.css';
import ProgressBar from './ProgressBar';
import { FaArrowLeft } from "react-icons/fa";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const WalletManager = () => {

  const handleCreateNewWallet = () => {
    window.location.href = './WalletCreation/CreateAccount';
  };

  const handleExistingWallet = () => {
    window.location.href = './WalletCreation/AddAccount';
  };

  const handleLeftArrowClick = () => {
    window.location.href = '/create-new-wallet';
  };  

  return (
    <div className="wallet-manager">
      <div className='card'>
        <div className="container">
          <div className="column left" onClick={handleLeftArrowClick}>
          <FaArrowLeft />
          </div>
          <div className="column middle">
            <ProgressBar currentStep={1} totalSteps={4} />
          </div>
          <div className="column right">
            {/* Right column content */}
          </div>
        </div>
        <div className="wallet-icon">
          <img src='/images/Dupay-Black.png' alt="DeFi Icon" />
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