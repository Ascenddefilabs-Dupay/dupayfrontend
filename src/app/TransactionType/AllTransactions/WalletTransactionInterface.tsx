

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './WalletTransaction.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import { QrReader } from 'react-qr-reader';

const WalletTransaction: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [userID, setUserID] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [scanning, setScanning] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>('');
  const [currency, setCurrency] = useState<string | null>(null);
  const router = useRouter();
  const [walletId, setWalletID] = useState<string | null>(null);
  const [walletAmount, setWalletAmount] = useState<number | null>(null);
  // const walletId = 'Wa0000000006'
  const cloudinaryBaseUrl = "https://res.cloudinary.com/dgfv6j82t/";
  const [flagIconUrl, setFlagIconUrl] = useState<string | null>(null);
  // const userID = 'DupC0003'

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
        const sessionCurrency = window.localStorage.getItem('SelectedCurrency');
        if (sessionCurrency) {
          setCurrency(sessionCurrency)
          // console.log(sessionCurrency);
        }
        
        if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId: string = sessionData.user_id;
            setUserID(storedUserId);
            console.log(storedUserId);
            // console.log(sessionData.user_email);
        } else {
            // router.push('/Userauthentication/SignIn');
        }
    }
}, [router]);


useEffect(() => {
  const fetchWalletAmount = async () => {
    try {
      const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/get-wallet-amount/', {
        wallet_id: walletId,
        currency: currency,
      });
      const { amount, error } = response.data;

      if (error) {
        setAlertMessage(error);
        // router.push('/Userauthorization/Dashboard/Home');
      } else {
        setWalletAmount(amount);
        setAlertMessage('');
      }
    } catch (error) {
      const axiosError = error as { response?: { data: { error: string } } };
      console.error("Error fetching wallet amount:", axiosError);
    }
  };

  const fetchCurrencyIcon = async () => {
    try {
      const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/get-currency-icon/', {
        currency: currency,
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

  
  fetchCurrencyIcon();
  fetchWalletAmount();
});


  useEffect(() => {
    // console.log(userID);
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully.");
    script.onerror = () => console.error("Failed to load Razorpay script.");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  


  const initiateRazorpayPayment = (amount: string, currency: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log('Razorpay is available.');
        const options = {
          key: 'rzp_test_41ch2lqayiGZ9X',
          amount: parseFloat(amount) * 100, 
          currency: currency,
          name: 'DUPAY',
          description: 'Payment for currency conversion',
          handler: (response: any) => {
            console.log('Payment successful:', response);
            setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            resolve(true);
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
          modal: {
            ondismiss: () => {
              resolve(false);
            },
          },
        };
        console.log('Razorpay options:', options);
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay script not loaded.");
        resolve(false);
      }
    });
  };


  const handlePaymentMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setPaymentMethod(value);
    setScanning(value === 'qrcode');
  };



const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  console.log('Form submitted');

  console.log('Current state:', {
      amount,
      mobileNumber,
      walletAddress,
      paymentMethod,
      userID,
  });

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setAlertMessage('Enter a valid amount');
      return;
  }

  const fixedCurrency = currency;
  
  const transactionHash = uuidv4();

  try {
      // Mobile payment method
      if (paymentMethod === 'mobile') {
          if (!mobileNumber.match(/^\d{10}$/)) {
              setAlertMessage('Enter a valid 10-digit mobile number');
              return;
          }

          const validationResponse = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/transaction_validation/', {
              transaction_amount: amount,
              transaction_currency: fixedCurrency,
              user_phone_number: mobileNumber,
              user_id: userID,
          });
          console.log('Validation response:', validationResponse.data); // Log response

          if (validationResponse.data.status !== 'success') {
              setAlertMessage(validationResponse.data.message);
              return;
          } else {
              const paymentSuccess = await initiateRazorpayPayment(amount,currency);
              console.log('Payment success:', paymentSuccess); // Log payment result
              if (paymentSuccess) {
                  const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/wallet_transfer/', {
                      transaction_type: 'Debit',
                      transaction_amount: amount,
                      transaction_currency: fixedCurrency,
                      transaction_status: 'Success',
                      transaction_fee: 0.0,
                      user_phone_number: mobileNumber,
                      transaction_method: 'Number transaction',
                      transaction_hash: transactionHash,
                      user_id: userID,
                  });
                  console.log('Wallet transfer response:', response.data); // Log response
                  setAlertMessage(`Transaction successful! Transaction ID: ${response.data.transaction_id}`);
                  window.location.href = '/Userauthorization/Dashboard/Home';
              }
          }

      // Wallet Address payment method
      } else if (paymentMethod === 'walletAddress') {
          if (!walletAddress) {
              setAlertMessage('Enter a valid wallet address');
              return;
          }

          const Addressresponse = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/validate-transaction/', {
              transaction_amount: amount,
              transaction_currency: fixedCurrency,
              fiat_address: walletAddress,
              transaction_method: 'fiat address transaction',
              user_id: userID,
          });
          console.log('Address validation response:', Addressresponse.data); // Log response

          if (Addressresponse.data.status === 'address_failure') {
            setAlertMessage('Entered fiat address does not exist.');
          } else if (Addressresponse.data.status === 'currency_failure') {
              setAlertMessage('Selected currency not found in the wallet.');
          } else if (Addressresponse.data.status === 'failure') {
              setAlertMessage('Insufficient funds for the transaction.');
          } else {
              const paymentSuccess = await initiateRazorpayPayment(amount, currency);
              console.log('Payment success:', paymentSuccess); // Log payment result

              if (paymentSuccess) {
                  try {
                      await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/address-transfer/', {
                          transaction_amount: amount,
                          transaction_currency: fixedCurrency,
                          transaction_type: 'Transfer',
                          fiat_address: walletAddress,
                          transaction_status: 'Success',
                          transaction_fee: 0.0,
                          transaction_hash: uuidv4(),
                          transaction_method: 'fiat address transaction',
                          user_id: userID,
                      });
                      setAlertMessage('Transaction successful!');
                      window.location.href = '/Userauthorization/Dashboard/Home';
                  } catch (error) {
                      console.error('Error storing transaction data:', error);
                      setAlertMessage('Error storing transaction data.');
                  }
              } else {
                setAlertMessage('Payment failed!');
              }
          }

      // QR Code payment method
      } else if (paymentMethod === 'qrcode') {
          if (!scannedData) {
            setAlertMessage('QR Code data not found');
              return;
          }
          const extractedMobileNumber = extractMobileNumber(scannedData);
          if (!extractedMobileNumber) {
            setAlertMessage('Invalid QR Code data');
              return;
          }
          setMobileNumber(extractedMobileNumber);
          console.log('Extracted mobile number from QR code:', extractedMobileNumber); // Log extracted number

          const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/validation-qrcode/', {
              transaction_amount: amount,
              transaction_currency: fixedCurrency,
              user_phone_number: mobileNumber,
              user_id: userID,
          });
          console.log('QR Code validation response:', response.data); // Log response

          if (response.data.status === 'failure') {
            setAlertMessage('Transaction Failure!');
              return;
          } else if (response.data.status === 'mobile_failure') {
            setAlertMessage("Number is not valid");
              return;
          } else if (response.data.status === 'insufficient_funds') {
            setAlertMessage("Insufficient Amount");
              return;
          } else if (response.data.status === 'currency_error') {
            setAlertMessage('User Does not have Currency');
              return;
          } else {
              const paymentSuccess = await initiateRazorpayPayment(amount, currency);
              console.log('Payment success:', paymentSuccess); // Log payment result

              if (paymentSuccess) {
                  try {
                      await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/qrcode/', {
                          transaction_type: 'Debit',
                          transaction_amount: amount,
                          transaction_currency: fixedCurrency,
                          transaction_status: 'Success',
                          transaction_fee: 0.0,
                          user_phone_number: mobileNumber,
                          transaction_hash: transactionHash,
                          transaction_method: 'QR transaction',
                          user_id: userID,
                      });
                      setAlertMessage('Transaction successful!');
                      window.location.href = '/Userauthorization/Dashboard/Home';
                  } catch (error) {
                      console.error('Error storing transaction data:', error);
                      setAlertMessage('Error storing transaction data.');
                  }
              } else {
                setAlertMessage('Payment failed!');
              }
          }

      } else {
        setAlertMessage('Select a valid payment method');
          return;
      }

  } catch (error: any) {
      console.error('Error during transaction processing:', error);
      setAlertMessage('An error occurred. Please try again later.');
  }
};

  const handleBackClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      router.push('/Userauthorization/Dashboard/Home');
    }, 2000); 
  };

  const handleCloseAlert = () => {
    setAlertMessage('');
  };


  const handleQRCodeScan = (data: string | null) => {
    if (data) {
      setScannedData(data);
      const extractedMobileNumber = extractMobileNumber(data);
      if (extractedMobileNumber) {
        setMobileNumber(extractedMobileNumber);
        setScanning(false);
        console.log('Extracted mobile number:', extractedMobileNumber); // Log the extracted number
      } else {
        setAlertMessage('Invalid QR Code data'); // Show an alert if mobile number extraction fails
      }
    }
  };

  const handleQRCodeError = (error: any) => {
    console.error(error);
  };

  const handleQRCodeSubmit = async () => {
    if (!scannedData) {
      setAlertMessage('QR Code data not found');
      return;
    }

    const extractedMobileNumber = extractMobileNumber(scannedData);
    if (!extractedMobileNumber) {
      setAlertMessage('Invalid QR Code data');
      return;
    }

    setMobileNumber(extractedMobileNumber);
    console.log(extractedMobileNumber);
    
  };



  const extractMobileNumber = (data: string): string | null => {
    const regex = /\b\d{10}\b/; // Regex to match a 10-digit mobile number
    const match = data.match(regex);
    return match ? match[0] : null; // Return the first matched number or null
  };

  const handleScanResult = (result: any) => {
    if (result) {
      const scannedText = result.getText();
      const mobile = extractMobileNumber(scannedText);
      if (mobile) {
        setMobileNumber(mobile);
        setScannedData(scannedText);
        setScanning(false); // Stop scanning after a successful scan
      } else {
        setAlertMessage('Invalid QR Code data'); // Alert for invalid data
      }
    }
  };


  return (
    <div className="wallet-transaction">
      <div className='setting_back_icon'>
        {showLoader && (
          <div className="loaderContainer">
            <div className="loader"></div>
          </div>
        )}
        {alertMessage && (
          <div className="customAlert">
            <p>{alertMessage}</p>
            <button onClick={() => setAlertMessage('')} className="closeButton">OK</button>
          </div>
        )}
  
        <div className="back" >
          <div onClick={handleBackClick} style={{ cursor: 'pointer' }}>
            <img
                  className='iconarrowLeftBack'
                  alt=""
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067208/1826c340-1853-453d-9ad0-6cafb099b947.png"
                />
              {/* <button onClick={handleBackClick}><ArrowBackIcon /></button> */}
              </div>
            <h2 className='form-heading'>Transfer Fiat {currency}</h2>
       
        </div>
      </div>
  
      <div className="wallet-form-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>

          <div className={"iconflagusParent"}>
              {flagIconUrl && (
                <img className={"flagicon"} alt="" src={flagIconUrl} />
              )}
              <div className={"content1"}>
                <div className={"listmbListItemBasic"}>
                  <div className={"listmbListItemitemLeft"}>
                    <div className={"title"}>Total {currency}</div>
                  </div>
                  <div className={"listmbListItemitemRight"}>
                    <div className={"title1"}>
                      {walletAmount !== null ? `${walletAmount} ${currency}` : `0 ${currency}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

  
            <div className="form-group payment-method-group">
              <label htmlFor="paymentMethod">Payment Through</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                required
              >
                <option value="" disabled>Select Payment Method</option>
                <option value="mobile">Through Mobile Number</option>
                <option value="walletAddress">Through Wallet Address</option>
                <option value="qrcode">Through QR Code</option>
              </select>
            </div>
  
            {/* QR Code Scanner */}
            {scanning && (
              <div className="scanner">
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode: 'environment' }}
                  videoStyle={{ width: '100%' }}
                />
              </div>
            )}
  
            {/* Show additional fields based on payment method */}
            {!scanning && paymentMethod === 'mobile' && (
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            )}
  
            {!scanning && paymentMethod === 'walletAddress' && (
              <div className="form-group">
                <label htmlFor="walletAddress">Wallet Address</label>
                <input
                  type="text"
                  id="walletAddress"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
            )}
  
            {/* Show amount input and submit button based on payment method */}
            {((paymentMethod && paymentMethod !== 'qrcode') || scannedData) && (
              <>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button className='button_class' type="submit">Submit</button>
              </>
            )}
          </form>
          {alertMessage && (
            <div className="alert">
              <span>{alertMessage}</span>
              <button onClick={handleCloseAlert}>Close</button>
            </div>
          )}
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    </div>
  );
  
};

export default WalletTransaction;
