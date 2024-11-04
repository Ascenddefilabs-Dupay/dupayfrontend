"use client";
import React, { useState } from 'react';
import axios from 'axios';
import './ChangePassword.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const ChangePassword: React.FC = () => {
  const [user_email, setEmail] = useState<string>('');
  const [user_password, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [verifyNewPassword, setVerifyNewPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [passwordMismatchError, setPasswordMismatchError] = useState<string>('');
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState<boolean>(false);

  const togglePasswordVisibility = (type: string) => {
    if (type === 'old') setShowOldPassword(!showOldPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'verify') setShowVerifyPassword(!showVerifyPassword);
  };

  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get(`https://securitymanagement-255574993735.asia-south1.run.app/passwordchangeapi/check-email/?email=${user_email}`);
      setEmailError(response.data.exists ? '' : 'Email not found');
    } catch (error) {
      setEmailError('Error checking email');
    }
  };

  const checkOldPassword = async (password: string) => {
    try {
      const response = await axios.post('https://securitymanagement-255574993735.asia-south1.run.app/passwordchangeapi/check-old-password/', {
        user_email,
        user_password: password,
      });
      setPasswordError(response.data.valid ? '' : 'Incorrect old password');
    } catch (error) {
      setPasswordError('Error checking old password');
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePasswords(value, verifyNewPassword);
  };

  const handleVerifyNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerifyNewPassword(value);
    validatePasswords(newPassword, value);
  };

  const validatePasswords = (newPassword: string, verifyNewPassword: string) => {
    if (newPassword === user_password) {
      setNewPasswordError('New password cannot be the same as old password');
    } else if (newPassword !== verifyNewPassword) {
      setPasswordMismatchError('New password and verify password do not match');
    } else {
      setNewPasswordError('');
      setPasswordMismatchError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (newPassword !== verifyNewPassword) {
      alert("New passwords don't match!");
      return;
    }
  
    try {
      await axios.post('https://securitymanagement-255574993735.asia-south1.run.app/passwordchangeapi/update-password/', {
        user_email,
        user_password,
        new_password: newPassword,
        verify_new_password: verifyNewPassword,
      });
      alert('Password changed successfully!');
    } catch (error) {
      const errorMsg = (error as any)?.response?.data?.message || 'Error updating password';
      alert(errorMsg);
    }
  };

  return (
    <div className="container">
      <div className="formWrapper">
        <h1 className="title">Change Password</h1>
        <form onSubmit={handleSubmit} className="formContent">
          <div className="inputGroup">
            <input
              type="email"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => checkEmailExists(user_email)}
              placeholder=" "
              className={`input ${emailError ? 'errorInput' : ''}`}
            />
            <label className="label">Email</label>
            {emailError && <span className="error">{emailError}</span>}
          </div>
          <div className="inputGroup">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={user_password}
              onChange={(e) => setOldPassword(e.target.value)}
              onBlur={() => checkOldPassword(user_password)}
              placeholder=" "
              className={`input ${passwordError ? 'errorInput' : ''}`}
            />
            <label className="label">Old Password</label>
            <i
              className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`}
              onClick={() => togglePasswordVisibility('old')}
            />
            {passwordError && <span className="error">{passwordError}</span>}
          </div>
          <div className="inputGroup">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder=" "
              className={`input ${newPasswordError ? 'errorInput' : ''}`}
            />
            <label className="label">New Password</label>
            <i
              className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`}
              onClick={() => togglePasswordVisibility('new')}
            />
            {newPasswordError && <span className="error">{newPasswordError}</span>}
          </div>
          <div className="inputGroup">
            <input
              type={showVerifyPassword ? 'text' : 'password'}
              value={verifyNewPassword}
              onChange={handleVerifyNewPasswordChange}
              placeholder=" "
              className="input"
            />
            <label className="label">Verify New Password</label>
            <i
              className={`fas ${showVerifyPassword ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`}
              onClick={() => togglePasswordVisibility('verify')}
            />
            {passwordMismatchError && <span className="error">{passwordMismatchError}</span>}
          </div>
          <button type="submit" className="submitButton">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
