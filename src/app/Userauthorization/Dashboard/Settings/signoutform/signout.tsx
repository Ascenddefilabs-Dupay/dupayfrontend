'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './SignOutDialog.css';

const SignOutDialog = () => {
  const [isChecked, setIsChecked] = useState(false);
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleGoBack = () => {
    let redirectUrl = '/Userauthorization/Dashboard/Settings';
    router.push(redirectUrl);
  };

  return (
    <div className="dialog-container">
      <div className="dialog">
        <div className="icon-container">
          <span className="icon">!</span>
        </div>
        <h2>Sign out of Wallet</h2>
        <p>Before signing out, back up your wallet by saving your recovery phrase. <a href="#">Learn more</a></p>
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="recoveryCheckbox" 
            checked={isChecked} 
            onChange={handleCheckboxChange}
          />
          <label htmlFor="recoveryCheckbox">I&aposve saved my recovery phrase.</label>
        </div>
        <button className="sign-out-button" disabled={!isChecked}>Sign out now</button>
        <button className="go-back-button" onClick={handleGoBack}>Go back</button>
      </div>
    </div>
  );
};

export default SignOutDialog;