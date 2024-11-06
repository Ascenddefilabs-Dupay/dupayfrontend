import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { FaArrowLeft ,FaAngleLeft } from 'react-icons/fa';
import './Topup.css';
import LottieAnimation from '@/app/assets/animation';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';
const FiatManagement = process.env.FiatManagement
const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X'; // Replace with actual key
// const API_BASE_URL = 'http://localhost:8000/fiatmanagementapi'; // Updated base URL for API requests
const API_BASE_URL=`${FiatManagement}/fiatmanagementapi`;

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
  const [DEFAULT_CURRENCY_TYPE, setDefaultCurrencyType] = useState<string>('INR');
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [flagIconUrl, setFlagIconUrl] = useState<string | null>(null);
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dgfv6j82t/";
  const [style, setStyle] = useState({ backgroundColor: '#222531', color:'#ffffff' });
  const [styles, setStyles] = useState({ top:'30%' });
  const [focused, setFocused] = useState(false);
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCurrency = localStorage.getItem('SelectedCurrency');
      setDefaultCurrencyType(storedCurrency || '');

    }
  }, []);
  const handleApiError = (error: any, context: string) => {
    console.error(`Error during ${context}:`, error);
    setError(`An error occurred while ${context.toLowerCase()}. Please try again.`);
    setLoading(false);
    setShowForm(true);
  };
  useEffect(() => {
    if (amount) {
      setStyles((prevStyles) => ({
        ...prevStyles,
        top:'50%',
      }));
      setStyle((prevStyle) => ({
        ...prevStyle,
        background: '#e2f0ff',
        color: '#000000',
      }));
    } else {
      setStyles((prevStyles) => ({
        ...prevStyles,
        top:'55%',
      }));
      setStyle((prevStyle) => ({
        ...prevStyle,
        background: '#222531',
        color: '#4c516b',
      }));
      
      
    }
  }, [amount])

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

  // const fetchCurrencyIcon = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/admincms/default_currency/?currency_type=${DEFAULT_CURRENCY_TYPE}`);
      
  //     const { icon } = response.data;  // Ensure this matches the response structure
  
  //     console.log('Raw icon URL:', icon); // Log the raw URL for debugging
  //     setCurrencyIcon(icon);
  
  //     // Ensure the URL is properly formatted
  //     const cleanedIconUrl = icon.trim(); // Remove any surrounding whitespace
  //   } catch (error) {
  //     handleApiError(error, 'fetching currency icon');
  //   }
  // };

  const fetchCurrencyIcon = async (currencyName:string) => {
    try {
      const response = await axios.post(`https://fiat-swap-255574993735.asia-south1.run.app/fiat_fiatSwap/get-currency-icon/`, {
        currency: currencyName.trim(),
      });
      

      if (response.data && response.data.icon_url) {
        const fullIconUrl = cloudinaryBaseUrl + response.data.icon_url; // Combine base URL with the relative path
        console.log("Fetched full icon URL:", fullIconUrl);
        setFlagIconUrl(fullIconUrl);
      } else {
        console.error("Icon URL not found in response:", response.data);
        setAlertMessage('Currency icon not found.');
      }
    } catch (error) {
      console.error("Error fetching currency icon:", error);
      // setAlertMessage('Failed to load currency icon.');
    }
  };
  
  // useEffect(() => {
  //   fetchCurrencyIcon(); // Fetch currency icon when component mounts
  // }, []);
  useEffect(() => {
    if (DEFAULT_CURRENCY_TYPE) {
      console.log("hi",DEFAULT_CURRENCY_TYPE )
      fetchCurrencyIcon(DEFAULT_CURRENCY_TYPE);
    }
  }, [DEFAULT_CURRENCY_TYPE]);

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

      const sessionData = localStorage.getItem('session_data'); // Retrieve session data from localStorage
      if (!sessionData) {
        console.error("No session data found in localStorage.");
        return;
      }

      const parsedSessionData = JSON.parse(sessionData);
      const storedWalletId = parsedSessionData.fiat_wallet_id; // Retrieve fiat_wallet_id from parsed session data
      console.log("Retrieved fiat_wallet_id from session data:", storedWalletId);

      if (!storedWalletId) {
        console.error("No wallet ID found in session data.");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/fiat_wallets/${storedWalletId}/`);
        setWalletDetails(response.data);
        setHasFetchedWalletDetails(true); // Set flag to true after fetching
      } catch (error) {
        handleApiError(error, 'fetching wallet details');
      }
    };

    fetchWalletDetails();
  }, [hasFetchedWalletDetails]);
  
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

  const [showLoader, setShowLoader] = useState<boolean>(false);
  
  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
  }, []);
return(

  <div>
      {showForm && (
        <div className="container">
          {alertMessage && (
            <div className="customAlert">
              <p>{alertMessage}</p>
              <button onClick={handleCloseAlert} className="closeButton">OK</button>
            </div>
          )}
          {showLoader && (
            <div className="loaderContainer" >
              <LottieAnimationLoading />
            </div>
          )}
          <img className="shapeIcon" alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729139397/4c03bd90-fdce-4081-9358-1e6849723549.png" />
          <div className="navbarnavBar">
            <div className="navbaritemleftBtn">
            <div className="iconiconWrapper">
            <img
              className="iconarrowLeftBack"
              alt="Back"
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728536746/f8f904f1-485a-42cc-93c6-a9abd4346f30.png"
              onClick={handleBack} // Attach click handler
              style={{ cursor: 'pointer' }} // Optional: Makes it look clickable
          />
            </div>
            </div>
            <div className="hereIsTitle">Topup {DEFAULT_CURRENCY_TYPE}</div>
            <div className="navbaritemrightBtn" />
            </div>
            <form  onSubmit={(e) => e.preventDefault()}>
          <div className="balanceCard">
                <div className="balanceDetails">
                    <img
                          src={flagIconUrl || ''}
                          alt={``}
                          className="currencyImage"
                        />
                    <div className="currencyText">
                        <span className="currencyCode">Total {DEFAULT_CURRENCY_TYPE}</span>
                    </div>
                    <div className="balanceAmount">
                      <span >{balance.toFixed(2)} </span>
                      <span >{DEFAULT_CURRENCY_TYPE}</span>
                    </div>
                </div>
            </div>
           
            <div className="amount-row">
              <div className="amount-group">
                <div className="howMuchUsd">How much {DEFAULT_CURRENCY_TYPE} do you want to top up?</div>
                <div className="input-container">
                  <label
                    className={`floating-label ${amount ? 'active' : ''} ${focused ? 'active' : ''}`}
                    htmlFor="amount"
                  >
                    Enter amount in {DEFAULT_CURRENCY_TYPE}
                  </label>
                  <input
                    type="tel"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    inputMode="numeric" // This will trigger the numeric keypad
                  />
                </div>
                
                
              </div>
            </div>
          <button
                className={`btnmbBtnFab swap-button ${isLoading ? 'disabled' : ''}`}
                style={styles}
                disabled={isLoading}
              >
                <div className="btnbtn" style={style} onClick={handleTopUp}>
                  <div className="text">{isLoading ? 'Processing...' : 'Topup'}</div>
                </div>
              </button>
          </form>
        </div>
      )}
    </div>
  );

};

export default TopUpForm;
