"use client"
import React, { useEffect, useState } from 'react';
import './Account.css';

const AddAccount = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false));
    return () => clearTimeout(timer);
  }, []);

    const handleClose = () => {
        window.location.href = './';
      };

    const handleImport = () => {
      setLoading(true)
      window.location.href = './ImportPassphrase';
    };

  return (
    // <div className="wallet-manager">
    <div>
    {loading ? (
      <div className='loading'>
        <div className='spinner'></div>
        <p className='loadingText'>LOADING</p>
      </div>
    ) : (
    <div className="add-account-container">
            <div className="add-account-header">
                <h1>Add Account</h1>
            </div>
            <div className="add-account-body">
                {/* <button className="add-account-button ledger">Set up Ledger</button> */}
                {/* <div className="divider">CREATE NEW</div>
                <button className="add-account-button">Create a new Passphrase Account</button> */}
                <div className="divider">IMPORT EXISTING ACCOUNTS</div>
                <button className="add-account-button" onClick={handleImport}>Import Passphrase</button>
                <button className="add-account-button">Import Private Key</button>
            </div>
            <button className="close-button" onClick={handleClose}>&times;</button>
            </div>
            )}
      </div>
    // </div>
  );
}

export default AddAccount;
