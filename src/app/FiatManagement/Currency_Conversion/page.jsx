"use client";
import styles from './page.css';
import axios from 'axios';
import React, { useState, useEffect, useCallback,Suspense } from 'react';
import country_list from '../CurrencyDropdown/country-list';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaEllipsisV, FaChevronRight } from 'react-icons/fa';
import networkOptions from '../NetworkPage/NetworkOptions';

// Authentication and role-based access hook
const useAuth = () => {
  const isAuthenticated = true; // Replace with actual authentication logic
  const hasRole = (role) => role === 'admin'; // Replace with actual role checking logic
  return { isAuthenticated, hasRole };
};

const CurrencyConverter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCurrency = searchParams.get('currency');
  const [fromCurrency, setFromCurrency] = useState('ETH'); 
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('0');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [network, setNetwork] = useState('OP Mainnet'); // Default value
  const [buy, setBuy] = useState('ETH');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [credit, setCredit] = useState('IMPS');
  const [provide, setProvide] = useState('Onramp Money');
  const cryptoApiKey = 'd87e655eb0580e20c381f19ecd513660587ebed07d93f102ac46a3efe32596ca';
  const [alertMessage, setAlertMessage] = useState('');
  const { isAuthenticated, hasRole } = useAuth(); // Use custom hook for protected routing
  const [showLoader, setShowLoader] = useState(true);

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

  const isFiatCurrency = (currency) => {
    return country_list.hasOwnProperty(currency);
  };

  const fetchConversionRates = useCallback(async () => {
    if (!fromCurrency || !toCurrency || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
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
        handler: function (response) {
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

  const handleKeypadClick = useCallback((key) => {
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

  const handleCurrencyChange = useCallback((currency) => {
    setToCurrency(currency);
    setShowBottomSheet(false);
  }, []);

  const handleAmountChange = useCallback((e) => {
    let value = e.target.value;

    if (value.startsWith('0') && value.length > 1 && !value.includes('.')) {
      value = value.replace(/^0+/, '');
    }

    setAmount(value);
  }, []);

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
   
      window.location.href = '/Userauthorization/Dashboard';
      
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
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
            {showLoader && (
                <div className="loaderContainer">
                    <div className="loader"></div>
                </div>
            )}
            <Suspense fallback={<div>Loading...</div>}>
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
            </Suspense>
        </div>

        
    );
};

export default CurrencyConverter;
 