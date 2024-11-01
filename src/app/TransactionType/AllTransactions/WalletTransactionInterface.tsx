

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './WalletTransaction.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { QrReader } from 'react-qr-reader';
import LottieAnimationLoading from '@/app/assets/LoadingAnimation';

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
    if (typeof window !== 'undefined') {
      const sessionStorageDataString = window.localStorage.getItem('session_data');
      if (sessionStorageDataString) {
        const wallet_id = JSON.parse(sessionStorageDataString);
        setWalletID(wallet_id.fiat_wallet_id);
      }
    }
  }, [router]);


  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        // const response = await axios.post('http://127.0.0.1:8000/transaction_api/get-wallet-amount/', {
          const response = await axios.post('http://127.0.0.1:8000/transaction_api/get-wallet-amount/', {
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
        // const response = await axios.post('http://127.0.0.1:8000/transaction_api/get-currency-icon/', {
          const response = await axios.post('http://127.0.0.1:8000/transaction_api/get-currency-icon/', {
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

        const validationResponse = await axios.post('http://127.0.0.1:8000/transaction_api/transaction_validation/', {
          transaction_amount: amount,
          transaction_currency: fixedCurrency,
          user_phone_number: mobileNumber,
          user_id: userID,
        });
        console.log('Validation response:', validationResponse.data); // Log response
        if (currency !== null) {
          if (validationResponse.data.status !== 'success') {
            setAlertMessage(validationResponse.data.message);
            return;
          } else {
            const paymentSuccess = await initiateRazorpayPayment(amount, currency);
            console.log('Payment success:', paymentSuccess); // Log payment result
            if (paymentSuccess) {
              const response = await axios.post('http://127.0.0.1:8000/transaction_api/wallet_transfer/', {
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
              // window.location.href = '/Userauthorization/Dashboard/Home';
              router.push('/Userauthorization/Dashboard/Home');
            }
          }
        }

        // Wallet Address payment method
      } else if (paymentMethod === 'walletAddress') {
        if (!walletAddress) {
          setAlertMessage('Enter a valid wallet address');
          return;
        }

        const Addressresponse = await axios.post('http://127.0.0.1:8000/transaction_api/validate-transaction/', {
          transaction_amount: amount,
          transaction_currency: fixedCurrency,
          fiat_address: walletAddress,
          transaction_method: 'fiat address transaction',
          user_id: userID,
        });
        console.log('Address validation response:', Addressresponse.data); // Log response

        if (currency !== null) {
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
                await axios.post('http://127.0.0.1:8000/transaction_api/address-transfer/', {
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
                // window.location.href = '/Userauthorization/Dashboard/Home';
                router.push('/Userauthorization/Dashboard/Home');
              } catch (error) {
                console.error('Error storing transaction data:', error);
                setAlertMessage('Error storing transaction data.');
              }
            } else {
              setAlertMessage('Payment failed!');
            }
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

        const response = await axios.post('http://127.0.0.1:8000/transaction_api/validation-qrcode/', {
          transaction_amount: amount,
          transaction_currency: fixedCurrency,
          user_phone_number: mobileNumber,
          user_id: userID,
        });
        console.log('QR Code validation response:', response.data); // Log response

        if (currency !== null) {
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
                await axios.post('http://127.0.0.1:8000/transaction_api/qrcode/', {
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
                // window.location.href = '/Userauthorization/Dashboard/Home';
                router.push('/Userauthorization/Dashboard/Home');
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
      }

    } catch (error: any) {
      console.error('Error during transaction processing:', error);
      setAlertMessage('An error occurred. Please try again later.');
    }
  };

  const handleBackClick = () => {
    setShowLoader(true);
    router.push('/Userauthorization/Dashboard/Home');
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150vh', width: '430px', backgroundColor: 'black' }}>
            {/* Show the Lottie loading animation */}
            <LottieAnimationLoading width="300px" height="300px" />
          </div>
        )}
        {alertMessage && (
          <div className="customAlert">
            <p>{alertMessage}</p>
            <button onClick={() => setAlertMessage('')} className="closeButton">OK</button>
          </div>
        )}

        <div className="back">
          <div onClick={handleBackClick} style={{ cursor: 'pointer' }} className='backarrow'>
            <img
              className='iconarrowLeftBack'
              alt=""
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067208/1826c340-1853-453d-9ad0-6cafb099b947.png"
            />
          </div>
          <h2 className='form-heading'>Transfer Fiat {currency}</h2>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>

          <div className={"content2"}>
            <div className={"content1"}>
              {flagIconUrl && (<img className={"flagicon"} alt="" src={flagIconUrl} />)}
              <div className={"title"}>Total {currency}</div>
            </div>
            <div className={"title1"}>
              {walletAmount !== null ? `${walletAmount} ${currency}` : `0 ${currency}`}
            </div>
          </div>

          <div className="form-grouppayment-method-group">
            <label htmlFor="paymentMethod">Payment Through</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              required
            >
              <option value="" disabled className="select-option">Select Payment Method</option>
              <option value="mobile" className="select-option">Through Mobile Number</option>
              <option value="walletAddress" className="select-option">Through Wallet Address</option>
              <option value="qrcode" className="select-option">Through QR Code</option>
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
              <div className='button_class_div1'>
                <div className='button_class_div'>
                <button
                  className='button_class'
                  type="submit"
                  disabled={!amount || !mobileNumber}  // Disable if amount is empty
                >
                  Submit
                </button>
                </div>
              </div>
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
              <div className='button_class_div1'>
                <div className='button_class_div'>
                <button
                  className='button_class'
                  type="submit"
                  disabled={!amount || !walletAddress}  // Disable if amount is empty
                >
                  Submit
                </button>
                </div>
              </div>
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
        </form>
        {alertMessage && (
          <div className="alert">
            <span>{alertMessage}</span>
            <button onClick={handleCloseAlert}>Close</button>
          </div>
        )}
        {message && <div className="message">{message}</div>}
      </div>


      <div className='bottom-design'>
        <svg width="190" height="230" viewBox="0 0 234 330" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M155.2 126.059C155.612 147.056 160.789 163.422 165.605 173.448C168.138 178.722 174.292 180.855 179.599 178.392C202.392 167.814 216.607 145.741 222.941 128.901C225.604 121.819 220.569 114.751 213.057 113.846C193.797 111.525 179.192 112.085 167.693 112.904C160.705 113.403 155.063 119.055 155.2 126.059Z" fill="url(#paint0_linear_2006_7570)" />
          <path d="M269.704 7.67764C205.104 10.1973 154.766 64.8036 157.296 129.666C159.826 194.529 214.264 245.049 278.864 242.529C343.465 240.01 393.802 185.403 391.272 120.54C388.742 55.6777 334.305 5.15799 269.704 7.67764Z" stroke="url(#paint1_linear_2006_7570)" stroke-width="6" />
          <circle cx="179.717" cy="179.717" r="176.717" transform="matrix(-0.0389741 -0.99924 -0.99924 0.0389741 373.168 461.044)" stroke="url(#paint2_linear_2006_7570)" stroke-width="6" />
          <circle cx="85" cy="85" r="82" transform="matrix(1 0 0 -1 59 188.831)" stroke="url(#paint3_linear_2006_7570)" stroke-width="6" />
          <defs>
            <linearGradient id="paint0_linear_2006_7570" x1="155.001" y1="169.053" x2="155.001" y2="130.553" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FF89C2" />
              <stop offset="0.5" stop-color="#F65BA4" />
              <stop offset="1" stop-color="#BD46F4" />
            </linearGradient>
            <linearGradient id="paint1_linear_2006_7570" x1="355.401" y1="74.8776" x2="149.438" y2="155.856" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E34D67" />
              <stop offset="0.5" stop-color="#FF67E0" />
              <stop offset="1" stop-color="#7746F4" />
            </linearGradient>
            <linearGradient id="paint2_linear_2006_7570" x1="249.844" y1="55.4737" x2="140.44" y2="367.975" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E34D67" />
              <stop offset="0.5" stop-color="#FF67E0" />
              <stop offset="1" stop-color="#7746F4" />
            </linearGradient>
            <linearGradient id="paint3_linear_2006_7570" x1="118.168" y1="26.2372" x2="66.4236" y2="174.04" gradientUnits="userSpaceOnUse">
              <stop stop-color="#E34D67" />
              <stop offset="0.5" stop-color="#FF67E0" />
              <stop offset="1" stop-color="#7746F4" />
            </linearGradient>
          </defs>
        </svg>
        
                  {/* <div className='bottom-blur'>
                <label >.</label>
            </div> */}
      </div>
    </div>
  );

};

export default WalletTransaction;
