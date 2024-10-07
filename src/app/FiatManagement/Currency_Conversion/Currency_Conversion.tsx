"use client";
import './page.css';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import country_list from '../CurrencyDropdown/country-list';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaEllipsisV, FaChevronRight } from 'react-icons/fa';

// Type definitions
type Role = 'admin' | 'user' | 'guest'; // Add more roles as needed

// Authentication and role-based access hook
const useAuth = () => {
  const isAuthenticated = true; // Replace with actual authentication logic
  const hasRole = (role: Role) => role === 'admin'; // Replace with actual role checking logic
  return { isAuthenticated, hasRole };
};

declare global {
  interface Window {
    Razorpay: any; // Declare Razorpay as a property on the window object
  }
}

const CurrencyConverter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCurrency = searchParams?.get('currency');

  const [fromCurrency, setFromCurrency] = useState<string>('ETH'); 
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [amount, setAmount] = useState<string>('0');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('OP Mainnet'); // Default value
  const [buy, setBuy] = useState<string>('ETH');
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [credit, setCredit] = useState<string>('IMPS');
  const [provide, setProvide] = useState<string>('Onramp Money');
  const cryptoApiKey = 'd87e655eb0580e20c381f19ecd513660587ebed07d93f102ac46a3efe32596ca';
  const [alertMessage, setAlertMessage] = useState<string>('');
  const { isAuthenticated, hasRole } = useAuth(); // Use custom hook for protected routing
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCurrency) {
      setToCurrency(selectedCurrency);
      setShowBottomSheet(true);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1500); // seconds delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const storedNetwork = localStorage.getItem('selectedNetwork');
    if (storedNetwork) {
      setNetwork(storedNetwork);
      setFromCurrency(storedNetwork); // Update fromCurrency to the selected network
    }
  }, []);

  const isFiatCurrency = (currency: string) => {
    return country_list.hasOwnProperty(currency);
  };

  const fetchConversionRates = useCallback(async () => {
    if (!fromCurrency || !toCurrency || !amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter valid input');
      setResult('');
      return;
    }

    try {
      if (isFiatCurrency(toCurrency) && !isFiatCurrency(fromCurrency)) {
        const response = await axios.get(
          `https://min-api.cryptocompare.com/data/price?fsym=${fromCurrency}&tsyms=${toCurrency}&api_key=${cryptoApiKey}`
        );
        const conversionRate = response.data[toCurrency];
        const cryptoValue = parseFloat(amount) / conversionRate;

        setResult(cryptoValue.toFixed(5));
        setAlertMessage(''); // Clear alert message
      } else {
        setAlertMessage('Invalid currency selection or unsupported conversion');
        setResult('');
      }
    } catch (err) {
      setAlertMessage('Error fetching conversion rate');
      setResult('');
    }
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    fetchConversionRates();
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiateRazorpayPayment = useCallback(() => {
    if (window.Razorpay) {
      const options = {
        key: 'rzp_test_41ch2lqayiGZ9X', // Your Razorpay API Key
        amount: parseFloat(amount) * 100, // Amount in paisa
        currency: 'INR',
        name: 'DUPAY',
        description: 'Payment for currency conversion',
        handler: function (response: any) {
          setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      setAlertMessage("Razorpay script not loaded.");
    }
  }, [amount]);

  const handleContinue = useCallback(() => {
    router.push('/Currenciespage');
  }, [router]);

  const toggleBottomSheet = useCallback(() => {
    setShowBottomSheet((prevState) => !prevState);
  }, []);

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prevState) => !prevState);
  }, []);

  const handleKeypadClick = useCallback((key: string) => {
    setAmount(prevAmount => {
      if (key === '←') {
        const newAmount = prevAmount.slice(0, -1);
        return newAmount === '' ? '0' : newAmount;
      } else if (key === '.') {
        if (!prevAmount.includes('.')) {
          return prevAmount === '' ? '0.' : prevAmount + '.';
        }
        return prevAmount;
      } else {
        if (prevAmount === '0' && key !== '.') {
          return key;
        } else {
          return prevAmount + key;
        }
      }
    });
  }, []);

  useEffect(() => {
    const storedPaymentOption = localStorage.getItem('selectedPaymentOption');
    if (storedPaymentOption) {
      setCredit(storedPaymentOption);
      setShowBottomSheet(false);
    }
  }, []);

  const handleCurrencyChange = useCallback((currency: string) => {
    setToCurrency(currency);
    setShowBottomSheet(false);
  }, []);

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
  };

  const navigateToBuy = useCallback(() => {
    router.push('/FiatManagement/BuyPage');
  }, [router]);

  const togglePaymentOptions = useCallback(() => {
    setShowPaymentOptions((prevState) => !prevState);
  }, []);

  const navigateToPaymentOptions = useCallback(() => {
    router.push('/FiatManagement/PaymentOptions');
  }, [router]);

  const navigateToCurrencySelector = useCallback(() => {
    router.push('/FiatManagement/CurrencyDropdown');
  }, [router]);

  const navigateToNetworkSelector = useCallback(() => {
    router.push('/FiatManagement/NetworkPage');
  }, [router]);

  const navigateToDashboard = useCallback(() => {
    setShowLoader(true);
    setTimeout(() => {

      // window.location.href = '/Userauthorization/Dashboard/Home';

      router.push('/Userauthorization/Dashboard/Home');
      setShowLoader(false);
    }, 3000);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
    setAmount("");
  }, []);

  if (!isAuthenticated || !hasRole('admin')) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="converterContainer">
      {alertMessage && (
        <div className='customAlert'>
          <p>{alertMessage}</p>
          <button onClick={handleCloseAlert} className="closeButton">OK</button>
        </div>
      )}
      {showLoader ? (
        <div className="loadingSpinner">
          <span className="spinner"></span>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="topBar">
                <button className="topBarButton">
                    <FaArrowLeft className="topBarIcon" onClick={navigateToDashboard} />

                </button>
                <div className="topBarTitle1">Buy</div>
                <button className="topBarButton1" onClick={toggleBottomSheet}>
                    <FaEllipsisV className="topBarIcon" />
                </button>
            </div>

            <div className="amountDisplay large">
                <input
                    type="text"
                    value={amount === '' ? '0' : amount}
                    onChange={handleAmountChange}
                    className="amountInput"
                    placeholder={`Enter amount in ${toCurrency}`}
                />
                <div className="amountContainer">
                    <span className="amountLabel">{toCurrency}</span>
                </div>
            </div>
            <div className="amountDisplay">
                <input
                    type="text"
                    value={result === '' ? '0' : result}
                    className="amountInput"
                    readOnly
                />
                <div className="amountContainer">
                    <span className="amountLabel">{fromCurrency}</span>
                </div>
            </div>
            
            <div className="resultDisplay">
                {error && <div className="error">{error}</div>}
            </div>

            <div className="paymentInfo" onClick={toggleDropdown}>
                <hr />
                <button className="networkInfo" onClick={navigateToNetworkSelector}>
                    <img src="/images/network.jpeg" alt="Network" className="icon" />
                    <span className="smallText">Network:</span>
                    <span className="networkDisplay">{network}</span>
                    <FaChevronRight className="arrow" /> 
                </button>



                <div className="paymentDetails">
                    <div className="paymentRow" onClick={navigateToBuy}>
                        <img src="/images/buy.jpeg" alt="Buy" className="icon" />
                        <div className="paymentTextContainer">
                            <div className="buyContainer">
                                <span className="buyText">Buy</span>
                                <FaChevronRight className="buyIcon" />
                                <div className="spacer"></div>
                                <span className="currencyText">{fromCurrency}</span>
                            </div>
                        </div>
                    </div>
                    <div className="separator"></div>
                    <div className="paymentRow" onClick={navigateToPaymentOptions}>
                        <img src="/images/paywith.png" alt="Pay with" className="icon" />
                        <div className="textContainer">
                            <span className='pay'>Pay with</span>
                            <FaChevronRight className="buyIcon2" />
                            <div className="spacer"></div>
                            <div className='credit'>{credit}</div>
                        </div>
                    </div>
                </div>
                <hr />
            </div>

            <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((key) => (
                    <button
                        key={key}
                        className="keypadButton"
                        onClick={() => handleKeypadClick(key)}
                    >
                        {key}
                    </button>
                ))}
            </div>
            
            <button className="continueButton" onClick={initiateRazorpayPayment}>Pay Now</button>
           
            {showBottomSheet && (
                <div className="bottomSheet">
                    <div className="bottomSheetHeader1">
                        <i className="fas fa-database"></i>
                        <div className="bottomSheetHeader">Change Currency</div>
                    </div>
                    <div className="bottomSheetContent">
                        <div className="bottomSheetRow" onClick={navigateToCurrencySelector}>
                            <span>{toCurrency}</span>
                            <i className="fas fa-check"></i>
                        </div>
                    </div>
                </div>
                
            )}
        </>
      )}
    </div>
  );
};

export default CurrencyConverter;
