"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './Account.css';

const AddAccount: React.FC = () => {
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
    const timer = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setLoading(true);
    //window.location.href = './';
    router.push('./'); 
  };

  const handleImport = () => {
    setLoading(true);
    //window.location.href = './ImportPassphrase';
    router.push('./ImportPassphrase'); 
  };

  return (
    <div>
      {loading ? (
        <div className='loading'>
          <div className='spinner'></div>
          {/* <p className='loadingText'>LOADING</p> */}
        </div>
      ) : (
        <div className="add-account-container">
          <div className="add-account-header">
            <h1>Add Account</h1>
          </div>
          <div className="add-account-body">
            <div className="divider">IMPORT EXISTING ACCOUNTS</div>
            <button className="add-account-button" onClick={handleImport}>Import Passphrase</button>
            <button className="add-account-button">Import Private Key</button>
          </div>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
      )}
    </div>
  );
}

export default AddAccount;
