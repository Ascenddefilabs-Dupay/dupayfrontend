import React, { useState, useEffect, useCallback } from 'react';
import './CurrencyConversion.css';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';
const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X';

const CurrencyConversion: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<string | null>('');
  const [sourceCurrency, setSourceCurrency] = useState<string>('INR');
  const [destinationCurrency, setDestinationCurrency] = useState<string>('USD');
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [conversionRate, setConversionRate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);

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

  const initiateRazorpayPayment = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        const options: any = {
          key: RAZORPAY_KEY,
          amount: parseFloat(amount) * 100,
          currency: sourceCurrency,
          name: 'DUPAY',
          description: 'Payment for currency conversion',
          handler: (response: any) => {
            setShowForm(true);
            setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            handleCurrencyConversion();
            resolve(true);
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: () => resolve(false),
          },
        };

        if (paymentMode === 'UPI') {
          options.method = 'upi';
          options.upi = {
            vpa: 'user@upi',
          };
        }

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.open();
      } else {
        setShowForm(true);
        setAlertMessage('Razorpay script not loaded.');
        resolve(false);
      }
    });
  };

  const fetchConversionRate = useCallback(async () => {
    if (!amount || !sourceCurrency || !destinationCurrency) {
      return;
    }

    try {
      const apiKey = '83403ce450fea7976d145137f91c7cd0';
      const url = `http://apilayer.net/api/live?access_key=${apiKey}&currencies=${destinationCurrency}&source=${sourceCurrency}&format=1`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        const rate = data.quotes[`${sourceCurrency}${destinationCurrency}`];
        const converted = (parseFloat(amount as string) * rate).toFixed(2);

        setConversionRate(rate.toString());
        setConvertedAmount(`${converted}`);
      } else {
        setAlertMessage(`Error: ${data.error.info}`);
      }
    } catch (error) {
      console.error('Error fetching the conversion rate:', error);
      setAlertMessage('An error occurred. Please try again later.');
    }
  }, [amount, sourceCurrency, destinationCurrency]);

  useEffect(() => {
    fetchConversionRate();
  }, [amount, sourceCurrency, destinationCurrency, fetchConversionRate]);

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

    if (inputValue === '') {
      setConvertedAmount('');
    } else if (conversionRate) {
      const converted = (parseFloat(inputValue) * parseFloat(conversionRate)).toFixed(2);
      setConvertedAmount(`${converted} ${destinationCurrency}`);
    }
  };

  const handleConvertedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    const validInput = /^[0-9]*\.?[0-9]*$/;

    if (!validInput.test(inputValue)) {
      return;
    }

    setConvertedAmount(inputValue);
  };

  const handleCurrencySwap = () => {
    const temp = sourceCurrency;
    setSourceCurrency(destinationCurrency);
    setDestinationCurrency(temp);
  };

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
  }, []);

  const handlePaymentModeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPaymentMode = e.target.value;
    setPaymentMode(selectedPaymentMode);
    
    console.log('Payment mode selected:', selectedPaymentMode);

    if (!amount || !sourceCurrency || !destinationCurrency || !selectedPaymentMode) {
      setAlertMessage('Please fill in all required fields.');
      setPaymentMode("Select Payment Method");
      return;
    }

    setShowForm(false);
    const paymentSuccess = await initiateRazorpayPayment();
    if (!paymentSuccess) {
      setShowForm(true);
      setAlertMessage("Payment Declined!");
      setPaymentMode("Select Payment Method");
    }
  };


  const handleCurrencyConversion = async () => {
    if (!amount || !conversionRate) {
      setAlertMessage('Invalid conversion data.');
      return;
    }
  
    setShowLoader(true);
  
    const walletId = 'Wa0000000002'; 
    const postData = {
      wallet_id: walletId,
      source_currency: sourceCurrency,
      destination_currency: destinationCurrency,
      amount: parseFloat(amount),
      conversion_rate: parseFloat(conversionRate),
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/fiatmanagementapi/convert_currency/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });
  
      const result = await response.json();
      if (result.status === 'success') {
        setAlertMessage('Currency conversion successful!');
      } else {
        setAlertMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error converting currency:', error);
      setAlertMessage('An error occurred. Please try again later.');
    } finally {
      setShowLoader(false);
    }
  };
  

  const handleLeftArrowClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard/Home';
      setShowLoader(false);
    }, 3000);
  };



  return (
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
            <div className="loaderContainer">
              <div className="loader"></div>
            </div>
          )}
          <div className="topBar">
            <button className="topBarButton" onClick={handleLeftArrowClick}>
              <FaArrowLeft className="topBarIcon" />
            </button>
            <h2 className="topBarTitle">Currency Conversion</h2>
          </div>

          <form>

            <div className="currency-row">
              <div className="currency-group">
                <label className="balance-label">Source Currency</label>
                <select
                  id="sourceCurrency"
                  value={sourceCurrency}
                  onChange={(e) => setSourceCurrency(e.target.value)}
                  required
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>

              <button
                type="button"
                className="swap-button"
                onClick={handleCurrencySwap}
                aria-label="Swap currencies"
              >
                <FaExchangeAlt className="swap-icon" />
              </button>

              <div className="currency-group">
                <label className="balance-label">Destination Currency</label>
                <select
                  id="destinationCurrency"
                  value={destinationCurrency}
                  onChange={(e) => setDestinationCurrency(e.target.value)}
                  required
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="amount-row">
              <div className="amount-group">
                <label className="balance-label">Enter Amount</label>
                <input
                  type="text"
                  id="amount"
                  placeholder={`Enter amount in ${sourceCurrency}`}
                  value={amount}
                  onChange={handleAmountChange}
                  required
                />
              </div>
              <div className="balance-labels">
                {sourceCurrency}
              </div>
            </div>

            <div className="amount-row">
              <div className="amount-group">
                <label className="balance-label">Converted Amount</label>
                <input
                  type="text"
                  id="convertedAmount"
                  placeholder={`Converted amount to ${destinationCurrency}`}
                  value={convertedAmount || ''}
                  onChange={handleConvertedAmountChange}
                  disabled
                />
              </div>
              <div className="balance-labels">
                {destinationCurrency}
              </div>
            </div>

            {/* <div className="payment-method-row">
              <label className="payment-method-label">Payment Method</label>
              <select
                id="paymentMode"
                value={paymentMode}
                onChange={handlePaymentModeChange}
              >
                <option value="">Choose Payment Option</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="NetBanking">Net Banking</option>
              </select>
            </div> */}

            <div className="payment-method">
              <label className="balance-label">Payment Method</label>
              <select
                value={paymentMode}
                onChange={handlePaymentModeChange}
              >
                <option value="">Select Payment Method</option>
                <option value="WalletBalance">WalletBalance</option>
                <option value="Cards">Cards</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CurrencyConversion;
