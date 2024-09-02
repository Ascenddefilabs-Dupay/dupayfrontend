import React, { useEffect, useState } from 'react';
import './WalletReady.css';
import { FaArrowLeft } from "react-icons/fa";

function WalletReady() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false));
    return () => clearTimeout(timer);
  }, []);

  const handleClaim = () => {
    // window.location.href = '/claim';
    setLoading(true)
    window.location.href = '/Userauthorization/Dashboard';
  };

  const handleLater = () => {
    // window.location.href = '/later';
    setLoading(true)
    window.location.href = '/Userauthorization/Dashboard';
  };

  const handleLeftArrowClick = () => {
    window.location.href = './WalletSecretCode/success/';
  };

  return (
    <div className="wallet-container">
      {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          <p className='loadingText'>LOADING</p>
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
