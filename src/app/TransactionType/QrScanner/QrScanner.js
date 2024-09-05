// 'use client'
// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid'; 
// import '../QrScanner/qrcode.css'; 
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useRouter } from 'next/navigation'

// const QRScanner = () => {
//   const [scanning, setScanning] = useState(false);
//   const [scannedData, setScannedData] = useState(null);
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [amount, setAmount] = useState('');
//   const [currency, setCurrency] = useState('');
//   const [alertMessage, setAlertMessage] = useState(''); 
//   const router = useRouter();

//   const currencies = [
//     { code: 'USD', name: 'United States Dollar' },
//     { code: 'GBP', name: 'British Pound' },
//     { code: 'EUR', name: 'Euro' },
//     { code: 'INR', name: 'Indian Rupee' },
//     { code: 'JPY', name: 'Japanese Yen' },
//   ];

//   const handleClick = () => {
//     setScanning(true);
//   };

//   const handleCancel = () => {
//     setScanning(false);
//   };

//   const handleAmountChange = e => {
//     setAmount(e.target.value);
//   };
  
//   const handleBackClick = () => {
//     let redirectUrl = '/TransactionType/WalletTransactionInterface';
//     router.push(redirectUrl);
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();

//     if (!currency) {
//       setAlertMessage('Select a valid currency');
//       return;
//     }
    
//     const transactionHash = uuidv4();
//     try {
//       const response = await axios.post('https://transactiontype-ind-255574993735.asia-south1.run.app/api/qrcode/', {
//         transaction_type: 'Debit',
//         transaction_amount: amount,
//         transaction_currency: currency,
//         transaction_status: 'Success',
//         transaction_fee: 0.0,
//         user_phone_number: mobileNumber,
//         transaction_hash: transactionHash,
//       });
//       if (response.data.status === 'failure'){
//         setAlertMessage('Transaction Failure!');
//       } else if (response.data.status === 'mobile_failure'){
//         setAlertMessage("Number is not valid");
//       } else if (response.data.status === 'insufficient_funds'){
//         setAlertMessage("Insufficient Amount");
//       } else if (response.data.status === 'currency_error'){
//         setAlertMessage('User Does not have Currency');
//       } else {
//         setAlertMessage('Transaction successful!');
//       }
//       setAmount('');
//       setCurrency('');
//     } catch (error) {
//       setAlertMessage(error.response ? error.response.data.detail : 'Error submitting transaction');
//     }
//   };

//   const handleCloseAlert = () => {
//     setAlertMessage('');
//     window.location.href = '/Userauthorization/Dashboard';
//   };

//   const extractMobileNumber = data => {
//     const regex = /\b\d{10}\b/;
//     const match = data.match(regex);
//     return match ? match[0] : null;
//   };

//   return (
//     <div className="qr-scanner-container no-scroll">
//       {alertMessage && (
//         <div className="customAlert">
//           <p>{alertMessage}</p>
//           <button onClick={handleCloseAlert} className="closeButton">OK</button>
//         </div>
//       )}
//       <div className='back_container'>
//         <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
//         <h1 className='heading'>Pay Through Scanner</h1>
//       </div>
  
//       {scanning ? (
//         <div className="scanner-wrapper">
//           <QrReader
//             onResult={(result, error) => {
//               if (result) {
//                 const scannedText = result?.text;
//                 const mobile = extractMobileNumber(scannedText);
//                 setMobileNumber(mobile);
//                 setScannedData(scannedText);
//                 setScanning(false);
//               }

//               if (error) {
//                 console.error(error);
//               }
//             }}
//             constraints={{ facingMode: 'environment' }}
//             style={{ width: '100%' }}
//           />
//           <button className="cancel-button" onClick={handleCancel}>
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <button className="scan-button" onClick={handleClick}>
//           Scan QR Code
//         </button>
//       )}
      
//       {mobileNumber && (
//         <>
//           <div className="currency-form1">
//             <label htmlFor="currency" className='currncy_name'>Currency:</label>
//             <select className='currency_type_drop_down'
//               id="currency"
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//               required
//             >
//               <option value="">Select a currency</option>
//               {currencies.map((currency) => (
//                 <option key={currency.code} value={currency.code}>
//                   {currency.name} ({currency.code})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <form onSubmit={handleSubmit} className="amount-form">
//             <label className='amount_label'>
//               Enter Amount:
//             </label>
//             <input
//               type="number"
//               value={amount}
//               onChange={handleAmountChange}
//               required
//             />
//             <div className='button_class'>
//               <button type="submit">Transfer</button>
//             </div>
//           </form>
//         </>
//       )}
//     </div>
//   );
// };

// export default QRScanner;




'use client'
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; 
import '../QrScanner/qrcode.css'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation'

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [alertMessage, setAlertMessage] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const userId = 'DupC0001';

  useEffect(() => {
    console.log(userId);
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully.");
    script.onerror = () => console.error("Failed to load Razorpay script.");
    document.body.appendChild(script);
    // Cleanup the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const currencies = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'JPY', name: 'Japanese Yen' },
  ];

  const initiateRazorpayPayment = (amount, currency) => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        const options = {
          key: 'rzp_test_41ch2lqayiGZ9X', // Your Razorpay API Key
          amount: parseFloat(amount) * 100, // Amount in paisa
          currency: currency,
          name: 'DUPAY',
          description: 'Payment for QR Code transaction',
          handler: function (response) {
            console.log('Payment successful:', response);
            setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            resolve(true); // Resolve true on successful payment
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: 9999999999,
          },
          notes: {
            address: 'Your Address',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: function() {
              resolve(false); // Resolve false if payment is cancelled
            }
          }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay script not loaded.");
        resolve(false);
      }
    });
  };

  const handleClick = () => {
    setScanning(true);
  };

  const handleCancel = () => {
    setScanning(false);
  };

  const handleAmountChange = e => {
    setAmount(e.target.value);
  };
  
  const handleBackClick = () => {
        setShowLoader(true);
        setTimeout(() => {
        router.push('/TransactionType/WalletTransactionInterface');
        setShowLoader(false); 
        }, 2000);
    // let redirectUrl = 'TransactionType/WalletTransactionInterface';
    // router.push(redirectUrl);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!currency) {
      setAlertMessage('Select a valid currency');
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setAlertMessage('Enter a valid amount');
      return;
    }

    const transactionHash = uuidv4();

    try {
      // Step 1: Server-side validation
      const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/validation-qrcode/', {
        transaction_amount: amount,
        transaction_currency: currency,
        user_phone_number: mobileNumber,
        user_id: userId,
      });

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

      // Step 2: Initiate Razorpay payment
          const paymentSuccess = await initiateRazorpayPayment(amount, currency);
      
          if (paymentSuccess) {
            try {
              await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/qrcode/', {
                transaction_type: 'Debit',
                transaction_amount: amount,
                transaction_currency: currency,
                transaction_status: 'Success',
                transaction_fee: 0.0,
                user_phone_number: mobileNumber,
                transaction_hash: transactionHash,
                transaction_method: 'QR transaction',
                user_id: userId,
              });
              setAlertMessage('Transaction successful!');
              setAmount('');
              setCurrency('');
              window.location.href = '/Userauthorization/Dashboard';
            } catch (error) {
              setAlertMessage('Error storing transaction data.');
              console.error('Error storing transaction data:', error.response ? error.response.data : error.message);
            }
          } else {
            setAlertMessage('Payment failed!')
          }
        }
    } catch (error) {
      setAlertMessage(error.response ? error.response.data.detail : 'Error submitting transaction');
    }
  };


  const extractMobileNumber = data => {
    const regex = /\b\d{10}\b/;
    const match = data.match(regex);
    return match ? match[0] : null;
  };

  return (
    <div className="qr-scanner-container no-scroll">
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
      <div className='back_container'>
        <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
        <h1 className='heading'>Pay Through Scanner</h1>
      </div>
  
      {scanning ? (
        <div className="scanner-wrapper">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                const scannedText = result?.text;
                const mobile = extractMobileNumber(scannedText);
                setMobileNumber(mobile);
                setScannedData(scannedText);
                setScanning(false);
              }

              if (error) {
                console.error(error);
              }
            }}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '100%' }}
          />
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="scan-button" onClick={handleClick}>
          Scan QR Code
        </button>
      )}
      
      {mobileNumber && (
        <>
          <div className="currency-form1">
            <label htmlFor="currency" className='currncy_name'>Currency:</label>
            <select className='currency_type_drop_down'
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
            >
              <option value="">Select a currency</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSubmit} className="amount-form">
            <label className='amount_label'>
              Enter Amount:
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              required
            />
            <div className='button_class'>
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Transfer'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default QRScanner;
