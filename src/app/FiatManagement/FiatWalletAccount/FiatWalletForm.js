import { useState } from 'react';
import axios from 'axios';
import styles from './FiatWalletForm.module.css';
import { FaArrowLeft } from 'react-icons/fa';

export default function FiatWalletForm() {
  const [walletType, setWalletType] = useState('');
  const [walletCurrency, setWalletCurrency] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

  const validateFields = () => {
    const newError = {};

    if (!walletType) {
      newError.walletType = 'Wallet Type is required.';
    }
    if (!walletCurrency) {
      newError.walletCurrency = 'Currency is required.';
    }
    if (!username) {
      newError.username = 'Username is required.';
    }
    const phoneRegex = /^\+?1?\d{9,15}$/;
    if (!phoneNumber.match(phoneRegex)) {
      newError.phoneNumber = 'Invalid phone number format.';
    }

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess(null);

    // Perform validation checks
    if (!validateFields()) {
        setAlertMessage('Please correct the errors before submitting.');
        return;
    }

    try {
        const userId = "DupC0007"; // Assuming this is the user ID from context or a placeholder.

        // Create the fiat wallet with the correct user ID
        const response = await axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/fiat_wallets/', {
            fiat_wallet_type: walletType,
            fiat_wallet_currency: walletCurrency.toUpperCase(),
            fiat_wallet_username: username,
            fiat_wallet_phone_number: phoneNumber,
            user: userId
        });

        setSuccess('Wallet created successfully!');
        setAlertMessage('Wallet created successfully!');
        setPhoneNumber('');
        setUsername('');
        setWalletCurrency('');
        setWalletType('');

        console.log('Wallet created:', response.data);
    } catch (error) {
        let errorMessage;

        if (error.response && error.response.data) {
            // Access specific error messages from the response
            if (error.response.data.username) {
                errorMessage = error.response.data.username;
            } else if (error.response.data.phoneNumber) {
                errorMessage = error.response.data.phoneNumber;
            } else if (error.response.data.detail) {
                errorMessage = error.response.data.detail; // Generic message if specific not found
            } else {
                errorMessage = 'Error creating wallet'; // Fallback message
            }
        } else {
            errorMessage = 'Error creating wallet';
        }

        setAlertMessage(errorMessage);
        console.error('Error creating wallet:', error);
    }
};
  

  const handleLeftArrowClick = () => {
    window.location.href = '/Userauthorization/Dashboard';
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };
  return (
    <div className={styles.container}>
      {alertMessage && (
                <div className={styles.customAlert}>
                    <p>{alertMessage}</p>
                    <button onClick={handleCloseAlert} className={styles.closeButton}>OK</button>
                </div>
            )}
      <div className={styles.topBar}>
            <button className={styles.topBarButton}>
                <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
            </button>
            <h2 className={styles.topBarTitle}>Create Fiat Wallet</h2>
        </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="walletType" className={styles.label}>Wallet Type:</label>
          <input
            type="text"
            id="walletType"
            placeholder="Enter Wallet Type"
            className={`${styles.input} ${error.walletType ? styles.error : ''}`}
            value={walletType}
            onChange={(e) => setWalletType(e.target.value)}
            required
          />
          {error.walletType && <p className={styles.error}>{error.walletType}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="walletCurrency" className={styles.label}>Currency:</label>
          <select
            id="walletCurrency"
            className={`${styles.input} ${error.walletCurrency ? styles.error : ''}`}
            value={walletCurrency}
            onChange={(e) => setWalletCurrency(e.target.value)}
            required
          >
            <option value="" disabled>Select Currency</option>
            <option value="INR">Indian Rupee (INR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
          {error.walletCurrency && <p className={styles.error}>{error.walletCurrency}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter Username"
            className={`${styles.input} ${error.username ? styles.error : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {error.username && <p className={styles.error}>{error.username}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber" className={styles.label}>Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            placeholder="Enter Phone Number"
            className={`${styles.input} ${error.phoneNumber ? styles.error : ''}`}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {error.phoneNumber && <p className={styles.error}>{error.phoneNumber}</p>}
        </div>
        {error.form && <p className={styles.error}>{error.form}</p>}
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
}
