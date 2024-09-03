'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './SignOutDialog.css';

const SignOutDialog = () => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleGoBack = () => {
    let redirectUrl = '/Userauthorization/Dashboard/Settings';
    router.push(redirectUrl);
  };
  const handleGoSignOut = () => {
    let redirectUrl = '/Userauthentication/SignIn';
    router.push(redirectUrl);
  }

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
          <label htmlFor="recoveryCheckbox">I've saved my recovery phrase.</label>
        </div>
        <button className="sign-out-button" disabled={!isChecked} onClick={handleGoSignOut}>Sign out now</button>
        <button className="go-back-button" onClick={handleGoBack}>Go back</button>
      </div>
    </div>
  );
};

export default SignOutDialog;