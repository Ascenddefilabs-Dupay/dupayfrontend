"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FiatWalletForm.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import Select, { SingleValue } from 'react-select';
import { useRouter } from 'next/navigation';


interface AccountTypeOption {
  value: string;
  label: string; // Changed JSX.Element to string for simplicity

interface CurrencyOption {
  value: string;
  label: JSX.Element | string;

}

interface Currency {
  currency_code: string;
  currency_country: string;
  currency_icon: string;
}

interface ErrorState {
  walletType?: string;
  walletCurrency?: string;
  username?: string;
  phoneNumber?: string;
  form?: string;
}

export default function FiatWalletForm() {

  const [accountType, setAccountType] = useState<string>("");
  const [walletName, setWalletName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [securityPin, setSecurityPin] = useState<string>("");

  const [walletType, setWalletType] = useState<string>('');
  const [walletCurrency, setWalletCurrency] = useState<string>('INR');
  const [username, setUsername] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [error, setError] = useState<ErrorState>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<SingleValue<CurrencyOption>>({ value: 'INR', label: 'INR' });
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
 
      } else {
        // router.push('http://localhost:3000/Userauthentication/SignIn')
      }
    }
  }, []);

  const validateFields = (): boolean => {
    const newError: ErrorState = {};


    if (!accountType) {
      newError.accountType = "Account type is required.";

  
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
    setAlertMessage(Object.keys(newError).length > 0 ? "Please correct the errors before submitting." : "");

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAlertMessage("");
  
    if (!validateFields()) {
      return;
    }
  
    const payload = {
      fiat_wallet_type: accountType,
      fiat_wallet_currency: selectedCurrency?.value || "",
      fiat_wallet_email: email,
      fiat_wallet_address: "", // Ensure this is handled server-side
      // fiat_wallet_phone_number: "", // Optional
      fiat_wallet_balance: 0, // Default balance
      user: userId,
    };
  
    try {
      setShowLoader(true);
  
      const response = await axios.post("https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/fiat_wallets/", payload);
      setAlertMessage("Wallet created successfully!");
      setAccountType("");
      setWalletName("");
      setEmail("");
      setSecurityPin("");
      setSelectedCurrency(null);
      setError({});
      router.push("/Userauthorization/Dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Error creating wallet";
        setAlertMessage(errorMessage);
        console.error("Error creating wallet:", error.response?.data);
      } else {
        setAlertMessage("Error creating wallet");
        console.error("Error creating wallet:", error);
      }
    } finally {
      setShowLoader(false);
    }
  };
  
  

  
    setError(newError);
  
    return Object.keys(newError).length === 0;
  };
  
// setUserId("DupC0001");
  useEffect(() => {
    axios.get(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/currencies/`)
      .then(response => setCurrencies(response.data))
      .catch(error => console.error('Error fetching currencies:', error));
  }, []);

  const currencyOptions: CurrencyOption[] = currencies.map(currency => ({
    value: currency.currency_code,
    label: (
      <div className={styles.currencyOption}>
        <img src={currency.currency_icon} alt={currency.currency_code} className={styles.currencyIcon} />
        {currency.currency_code} - {currency.currency_country}
      </div>
    ),
  }));

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowLoader(false);
  //   }, 3000); // 3 seconds delay
  //   return () => clearTimeout(timer);
  // }, []);

  const handleCurrencyChange = (option: SingleValue<CurrencyOption>) => {
    if (option) {
      setSelectedCurrency(option);
      setWalletCurrency(option.value);
  
      // Clear the currency error only if it exists
      setError((prevError) => {
        if (prevError.walletCurrency) {
          return { ...prevError, walletCurrency: '' };
        }
        return prevError;
      });
    }
  };
  


  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#2a2a2a',
      borderColor: '#555',
      color: 'white',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#2a2a2a',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#777' : '#2a2a2a',
      color: 'white',
    }),
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess(null);
    setAlertMessage('');
    
    // Run validation only when the user submits the form
    if (!validateFields()) {
      return;
    }
  
    try {
      setShowLoader(true);
  
      const response = await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/fiat_wallets/', {
        fiat_wallet_type: walletType,
        fiat_wallet_currency: walletCurrency.toUpperCase(),
        fiat_wallet_username: username,
        fiat_wallet_phone_number: phoneNumber,
        user: userId, // Use the state userId here
      });
  
      setSuccess('Wallet created successfully!');
      setAlertMessage('Wallet created successfully!');
      setPhoneNumber('');
      setUsername('');
      setWalletCurrency('INR'); // Set a default value or as needed
      setWalletType('');
      setError({});
    } catch (error) {
      let errorMessage: string;
  
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        if (error.response && error.response.data) {
          if (error.response.data.fiat_wallet_username) {
            errorMessage = error.response.data.fiat_wallet_username;
          } else if (error.response.data.fiat_wallet_phone_number) {
            errorMessage = error.response.data.fiat_wallet_phone_number;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else {
            errorMessage = 'Error creating wallet';
          }
        } else {
          errorMessage = 'Error creating wallet';
        }
      } else {
        errorMessage = 'Error creating wallet';
      }
  
      setAlertMessage(errorMessage);
      console.error('Error creating wallet:', error);
    } finally {
      setShowLoader(false); 
    }
  };
  
  
  const handleLeftArrowClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false);
    }, 3000);

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
      {showLoader && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
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
          <Select
            options={currencyOptions}
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className={styles.select}
            styles={customSelectStyles}
          />
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