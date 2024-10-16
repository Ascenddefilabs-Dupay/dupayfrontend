import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { FaArrowLeft ,FaAngleLeft } from 'react-icons/fa';
import styles from './Topup.module.css';

const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X'; // Replace with actual key
// const API_BASE_URL = 'http://localhost:8000/fiatmanagementapi'; // Updated base URL for API requests
const API_BASE_URL='https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi';

interface WalletDetails {
  fiat_wallet_id: string;
  fiat_wallet_address: string;
  fiat_wallet_balance: string;
  fiat_wallet_phone_number: string;
  currency_icon: string; 
}

interface UserCurrency {
  currency_type: string | null; // Allow null to handle possible null values
  balance: string; // Ensure balance is a string to match the API response
}

const TopUpForm: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);
  const router = useRouter();
  const [hasFetchedWalletDetails, setHasFetchedWalletDetails] = useState(false);
  const [currencyIcon, setCurrencyIcon] = useState<string | null>(null);
  // const DEFAULT_CURRENCY_TYPE = localStorage.getItem('SelectedCurrency') || 'INR';
  // console.log('Default Currency Type:', DEFAULT_CURRENCY_TYPE);
  const [DEFAULT_CURRENCY_TYPE, setDefaultCurrencyType] = useState<string>('INR');
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCurrency = localStorage.getItem('SelectedCurrency');
      setDefaultCurrencyType(storedCurrency || 'INR');
    }
  }, []);
  const handleApiError = (error: any, context: string) => {
    console.error(`Error during ${context}:`, error);
    setError(`An error occurred while ${context.toLowerCase()}. Please try again.`);
    setLoading(false);
    setShowForm(true);
  };
  

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const validInput = /^[0-9]*\.?[0-9]*$/;

    if (!validInput.test(inputValue)) {
      return;
    }

    if (inputValue.length > 1 && inputValue.startsWith('0') && inputValue[1] !== '.') {
      inputValue = inputValue.slice(1);
    }

    if (inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts[1].length > 2) {
        parts[1] = parts[1].slice(0, 2);
      }
      inputValue = parts.join('.');
    }
    
    setAmount(inputValue);
    setIsButtonVisible(!!inputValue);
    if (submitted) {
      setError('');
    }
  };

  const fetchUserCurrencyBalance = async () => {
    if (walletDetails) {
      try {
        const response = await axios.get(`${API_BASE_URL}/user_currencies/?wallet_id=${walletDetails.fiat_wallet_id}`);
        
        const userCurrency = response.data.find((currency: UserCurrency) => currency.currency_type === DEFAULT_CURRENCY_TYPE);
        
        const newBalance = userCurrency ? parseFloat(userCurrency.balance) : 0;
        setBalance(newBalance);
        console.log(`Fetched balance: ${newBalance} ${DEFAULT_CURRENCY_TYPE}`); // Log the balance
      } catch (error) {
        handleApiError(error, 'fetching user currency balance');
      }
    }
  };

  const fetchCurrencyIcon = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admincms/default_currency/?currency_type=${DEFAULT_CURRENCY_TYPE}`);
      
      const { icon } = response.data;  // Ensure this matches the response structure
  
      console.log('Raw icon URL:', icon); // Log the raw URL for debugging
      setCurrencyIcon(icon);
  
      // Ensure the URL is properly formatted
      const cleanedIconUrl = icon.trim(); // Remove any surrounding whitespace

      // if (cleanedIconUrl && cleanedIconUrl.startsWith("https://res.cloudinary.com/")) {
      //   setCurrencyIcon(cleanedIconUrl); // Set the cleaned URL
      // } else {
      //   console.error("Invalid URL format:", cleanedIconUrl);
      // }
  
    } catch (error) {
      handleApiError(error, 'fetching currency icon');
    }
  };
  
  
  
  

  useEffect(() => {
    fetchCurrencyIcon(); // Fetch currency icon when component mounts
  }, []);

  useEffect(() => {
    const loadRazorpayScript = () => {
      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      }
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (hasFetchedWalletDetails) return; // Prevent re-fetching
      try {
        const response = await axios.get(`${API_BASE_URL}/fiat_wallets/Wa0000000003/`);
        setWalletDetails(response.data);
        setHasFetchedWalletDetails(true); // Set flag to true after fetching
      } catch (error) {
        handleApiError(error, 'fetching wallet details');
      }
    };
    fetchWalletDetails();
  }, [hasFetchedWalletDetails]); // Depend on the flag
  
  useEffect(() => {
    fetchUserCurrencyBalance(); // Fetch balance whenever wallet details change
  }, [walletDetails]);

  const initiateRazorpayPayment = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        const options = {
          key: RAZORPAY_KEY,
          amount: parseFloat(amount) * 100,
          currency: DEFAULT_CURRENCY_TYPE,
          name: 'DUPAY',
          description: 'Top-Up Payment',
          handler: (response: any) => {
            setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            resolve(true);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9380660939',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: () => resolve(false),
          },
        };
        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        setAlertMessage('Razorpay script not loaded.');
        resolve(false);
      }
    });
  };

  const handleTopUp = async () => {
    setSubmitted(true);
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAlertMessage('Please enter a valid amount greater than zero.');
      return;
    }

    if (!walletDetails) {
      setAlertMessage('Wallet details not loaded.');
      return;
    }

    setLoading(true);
    setShowForm(false);

    try {
      const paymentSuccess = await initiateRazorpayPayment();
      if (!paymentSuccess) {
        setAlertMessage('Payment failed or was cancelled.');
        return;
      }

      const topUpData = {
        wallet_id: walletDetails.fiat_wallet_id,
        currency_code: DEFAULT_CURRENCY_TYPE, // Using only INR for now
        amount: parsedAmount,
        currency_country: 'YourCountry', // Adjust this value as needed
        transaction_hash: uuidv4(),
      };

      await axios.post(`${API_BASE_URL}/user_currencies/topup/`, topUpData);

      // Update the balance in state after successful top-up
      setBalance((prevBalance) => prevBalance + parsedAmount);

      setAlertMessage('Top-up successful!');
      localStorage.removeItem('SelectedCurrency');
      router.push('/Userauthorization/Dashboard/Home');
    } catch (error) {
      handleApiError(error, 'processing top-up');
    } finally {
      setLoading(false);
      setShowForm(true);
    }
  };

  const handleBack = () => {
    router.push('/Userauthorization/Dashboard/Home'); // Navigate to the Dashboard Home
  };

  return (
    <div className={styles.topUpFormContainer}>
      <button className={styles.backButton} onClick={handleBack}>
      <FaAngleLeft className={styles.arrowIcon} />
      <span className={styles.buttonText}>Topup {DEFAULT_CURRENCY_TYPE} </span>
    </button>

      {loading && <div className={styles.loading}>Processing...</div>}
      {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
      {showForm && (
        <form className={styles.topUpFormContent} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <div className={styles.totalBalanceRow}>
              {/* Left side: Total and default currency */}
              <div className={styles.totalSection}>
                {currencyIcon && (
                    <img
                      src={currencyIcon}
                      alt={`${DEFAULT_CURRENCY_TYPE} icon`}
                      className={styles.currencyIcon}
                    />
                  )}
                <span className={styles.label}>Total</span>
                <span className={styles.defaultCurrencyType}>{DEFAULT_CURRENCY_TYPE}</span>
              </div>
              
              {/* Right side: Balance and default currency */}
              <div className={styles.balanceSection}>
                <span className={styles.balance}>{balance.toFixed(2)}</span>
                <span className={styles.defaultCurrencyType}>{DEFAULT_CURRENCY_TYPE}</span>
                

              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amountInput" className={styles.label1}>How much {DEFAULT_CURRENCY_TYPE} do you want to top up?</label>
            <input
              id="amountInput"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Enter amount in ${DEFAULT_CURRENCY_TYPE}`}
              className={styles.amountInput}
            />
          </div>
          <div className={styles.svgContainer}>
          <svg width="200" height="220" viewBox="0 0 204 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M155.2 126.059C155.612 147.056 160.789 163.422 165.605 173.448C168.138 178.722 174.292 180.855 179.599 178.392C202.392 167.814 216.607 145.741 222.941 128.901C225.604 121.819 220.569 114.751 213.057 113.846C193.797 111.525 179.192 112.085 167.693 112.904C160.705 113.403 155.063 119.055 155.2 126.059Z" fill="url(#paint0_linear_2006_7547)"/>
            <path d="M269.704 7.67764C205.104 10.1973 154.766 64.8036 157.296 129.666C159.826 194.529 214.264 245.049 278.864 242.529C343.465 240.01 393.802 185.403 391.272 120.54C388.742 55.6777 334.305 5.15799 269.704 7.67764Z" stroke="url(#paint1_linear_2006_7547)" stroke-width="6"/>
            <circle cx="179.717" cy="179.717" r="176.717" transform="matrix(-0.0389741 -0.99924 -0.99924 0.0389741 373.168 461.044)" stroke="url(#paint2_linear_2006_7547)" stroke-width="6"/>
            <circle cx="85" cy="85" r="82" transform="matrix(1 0 0 -1 59 188.831)" stroke="url(#paint3_linear_2006_7547)" stroke-width="6"/>
            <defs>
            <linearGradient id="paint0_linear_2006_7547" x1="155.001" y1="169.053" x2="155.001" y2="130.553" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FF89C2"/>
            <stop offset="0.5" stop-color="#F65BA4"/>
            <stop offset="1" stop-color="#BD46F4"/>
            </linearGradient>
            <linearGradient id="paint1_linear_2006_7547" x1="355.401" y1="74.8776" x2="149.438" y2="155.856" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E34D67"/>
            <stop offset="0.5" stop-color="#FF67E0"/>
            <stop offset="1" stop-color="#7746F4"/>
            </linearGradient>
            <linearGradient id="paint2_linear_2006_7547" x1="249.844" y1="55.4737" x2="140.44" y2="367.975" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E34D67"/>
            <stop offset="0.5" stop-color="#FF67E0"/>
            <stop offset="1" stop-color="#7746F4"/>
            </linearGradient>
            <linearGradient id="paint3_linear_2006_7547" x1="118.168" y1="26.2372" x2="66.4236" y2="174.04" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E34D67"/>
            <stop offset="0.5" stop-color="#FF67E0"/>
            <stop offset="1" stop-color="#7746F4"/>
            </linearGradient>
            </defs>
            </svg>
          </div>
          <div className="topUpButtonCard">
 

          <button
            type="button"
            className={`${styles.topUpButton} ${isButtonVisible ? styles.active : styles.inactive}`} // Toggle between visible and hidden states
            onClick={handleTopUp}
            disabled={!isButtonVisible || loading} // Button is disabled if not visible or loading
          >
            Top Up
          </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      )}
    </div>
  );
};

export default TopUpForm;
