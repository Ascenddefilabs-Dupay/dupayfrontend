
// 'use client'

// import { v4 as uuidv4 } from 'uuid'; 
// import React, { useState } from 'react';
// import axios from 'axios';
// import './AddressBasedTransactionForm.css'; // Ensure the path to your CSS file is correct
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
// import { useRouter } from 'next/navigation'

// const AddressBasedTransactionForm = () => {
//   const [transactionAmount, setTransactionAmount] = useState('');
//   const [transactionCurrency, setTransactionCurrency] = useState('');
//   const [fiatAddress, setFiatAddress] = useState('');
//   const [alertMessage, setAlertMessage] = useState(''); // State for alert message
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const currencies = [
//     { code: 'USD', name: 'United States Dollar' },
//     { code: 'GBP', name: 'British Pound' },
//     { code: 'EUR', name: 'Euro' },
//     { code: 'INR', name: 'Indian Rupee' },
//     { code: 'JPY', name: 'Japanese Yen' },
//     // Add more currencies as needed
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate amount
//     if (isNaN(transactionAmount) || transactionAmount <= 0) {
//       setAlertMessage('Enter a valid amount');
//       return;
//     }

//     // Validate currency selection
//     if (!transactionCurrency) {
//       setAlertMessage('Select a valid currency');
//       return;
//     }

//     // Validate fiat address
//     if (!fiatAddress) {
//       setAlertMessage('Enter a valid fiat address');
//       return;
//     }

//     setLoading(true);
//     const transactionHash = uuidv4();
//     const transactionDescription = 'fiat address transaction';

//     try {
//       const response = await axios.post('https://transactiontype-ind-255574993735.asia-south1.run.app/api/address-transfer/', {
//         transaction_amount: transactionAmount,
//         transaction_currency: transactionCurrency,
//         transaction_type: 'Debit',
//         transaction_status: 'Success',
//         fiat_address: fiatAddress,
//         transaction_fee: 0.0,
//         transaction_hash: transactionHash,
//         transaction_method: transactionDescription,
//       });

//       if (response.data.status === 'address_failure') {
//         setAlertMessage('Entered fiat address does not exist.');
//       } else if (response.data.status === 'currency_failure') {
//         setAlertMessage('Selected currency not found in the wallet.');
//       } else if (response.data.status === 'failure') {
//         setAlertMessage('Insufficient funds for the transaction.');
//       } else {
//         setAlertMessage('Transaction successful!');
//         setTransactionAmount('');
//         setTransactionCurrency('');
//         setFiatAddress('');
//       }

//     } catch (error) {
//       setAlertMessage(error.response ? error.response.data.error : 'Error submitting transaction');
//       console.error('Error submitting transaction:', error.response ? error.response.data : error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseAlert = () => {
//     setAlertMessage('');
//     window.location.href = '/Userauthorization/Dashboard';
//   };

//   const settinghandleBackClick = () => {
//     let redirectUrl = '/TransactionType/WalletTransactionInterface';
//     router.push(redirectUrl);
//   };

//   return (
//     <div className="address-based-transaction-form-container">
//       {alertMessage && (
//         <div className="customAlert">
//           <p>{alertMessage}</p>
//           <button onClick={handleCloseAlert} className="closeButton">OK</button>
//         </div>
//       )}
//       <form className="address-based-transaction-form" onSubmit={handleSubmit}>
//         <div className='back_container'>
//            <ArrowBackIcon className="setting_back_icon" onClick={settinghandleBackClick} />
//            <h2 className="form-heading">Fiat Wallet Transaction</h2>
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="transactionCurrency">Currency:</label>
//           <select
//             id="transactionCurrency"
//             value={transactionCurrency}
//             onChange={(e) => setTransactionCurrency(e.target.value)}
//             required
//           >
//             <option value="">Select a currency</option>
//             {currencies.map((currency) => (
//               <option key={currency.code} value={currency.code}>
//                 {currency.name} ({currency.code})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="transactionAmount">Amount:</label>
//           <input
//             type="number"
//             id="transactionAmount"
//             value={transactionAmount}
//             onChange={(e) => setTransactionAmount(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="fiatAddress">Fiat Address:</label>
//           <input
//             type="text"
//             id="fiatAddress"
//             value={fiatAddress}
//             onChange={(e) => setFiatAddress(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" disabled={loading} className='button_class'>
//           {loading ? 'Processing...' : 'Transfer'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddressBasedTransactionForm;




// 'use client';
// import { v4 as uuidv4 } from 'uuid'; 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AddressBasedTransactionForm.css'; // Ensure the path to your CSS file is correct
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
// import { useRouter } from 'next/navigation';
// const AddressBasedTransactionForm = () => {
//   const [transactionAmount, setTransactionAmount] = useState('');
//   const [transactionCurrency, setTransactionCurrency] = useState('');
//   const [fiatAddress, setFiatAddress] = useState('');
//   const [alertMessage, setAlertMessage] = useState(''); // State for alert message
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [showLoader, setShowLoader] = useState(false);
//   const userId = 'DupC0001';

//   useEffect(() => {
//     console.log(userId);
//     // Load Razorpay script
//     const script = document.createElement('script');
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => console.log("Razorpay script loaded successfully.");
//     script.onerror = () => console.error("Failed to load Razorpay script.");
//     document.body.appendChild(script);
//     // Cleanup the script when component unmounts
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);
//   const currencies = [
//     { code: 'USD', name: 'United States Dollar' },
//     { code: 'GBP', name: 'British Pound' },
//     { code: 'EUR', name: 'Euro' },
//     { code: 'INR', name: 'Indian Rupee' },
//     { code: 'JPY', name: 'Japanese Yen' },
//     // Add more currencies as needed
//   ];
//   const initiateRazorpayPayment = (amount, currency) => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         console.log('Razorpay is available.');
//         const options = {
//           key: 'rzp_test_41ch2lqayiGZ9X', // Your Razorpay API Key
//           amount: parseFloat(amount) * 100, // Amount in paisa
//           currency: currency,
//           name: 'DUPAY',
//           description: 'Payment for currency conversion',
//           handler: function (response) {
//             console.log('Payment successful:', response);
//             setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
//             resolve(true); // Resolve true on successful payment
//           },
//           prefill: {
//             name: 'User Name',
//             email: 'user@example.com',
//             contact: '9999999999',
//           },
//           notes: {
//             address: 'Your Address',
//           },
//           theme: {
//             color: '#F37254',
//           },
//           modal: {
//             ondismiss: function() {
//               resolve(false); // Resolve false if payment is cancelled
//             }
//           }
//         };
//         console.log('Razorpay options:', options);
//         const rzp1 = new window.Razorpay(options);
//         rzp1.open();
//       } else {
//         console.error("Razorpay script not loaded.");
//         resolve(false);
//       }
//     });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Step 1: Client-side validations
//     if (isNaN(transactionAmount) || transactionAmount <= 0) {
//         setAlertMessage('Enter a valid amount');
//         return;
//     }
//     if (!transactionCurrency) {
//         setAlertMessage('Select a valid currency');
//         return;
//     }
//     if (!fiatAddress) {
//         setAlertMessage('Enter a valid fiat address');
//         return;
//     }
//     // Step 2: Server-side validation and initiate Razorpay payment only if validation succeeds
//     try {
//         const response = await axios.post('http://127.0.0.1:8000/transaction_api/validate-transaction/', {
//             transaction_amount: transactionAmount,
//             transaction_currency: transactionCurrency,
//             fiat_address: fiatAddress,
//             transaction_method: 'fiat address transaction', // Example description
//             user_id: userId,
//         });
//         // Handle different server-side validation responses
//         if (response.data.status === 'address_failure') {
//             setAlertMessage('Entered fiat address does not exist.');
//         } else if (response.data.status === 'currency_failure') {
//             setAlertMessage('Selected currency not found in the wallet.');
//         } else if (response.data.status === 'failure') {
//             setAlertMessage('Insufficient funds for the transaction.');
//         } else {
//             // Step 3: Initiate Razorpay payment if all validations pass
//             const paymentSuccess = await initiateRazorpayPayment(transactionAmount, transactionCurrency);
//             // Step 4: Store transaction data only if Razorpay payment succeeds
//             if (paymentSuccess) {
//                 try {
//                     await axios.post('http://127.0.0.1:8000/transaction_api/address-transfer/', {
//                         transaction_amount: transactionAmount,
//                         transaction_currency: transactionCurrency,
//                         transaction_type: 'Transfer',
//                         fiat_address: fiatAddress,
//                         transaction_status: 'Success',
//                         transaction_fee: 0.0,
//                         transaction_hash: uuidv4(),
//                         transaction_method: 'fiat address transaction',
//                         user_id: userId,
//                     });
//                     setAlertMessage('Transaction successful!');
//                     // Reset form fields after successful submission
//                     setTransactionAmount('');
//                     setTransactionCurrency('');
//                     setFiatAddress('');
//                     window.location.href = '/Userauthorization/Dashboard';
//                 } catch (error) {
//                     setAlertMessage('Error storing transaction data.');
//                     console.error('Error storing transaction data:', error.response ? error.response.data : error.message);
//                 }
//             } else {
//                 setAlertMessage('Payment failed!');
//             }
//         }
//     } catch (error) {
//         setAlertMessage(error.response ? error.response.data.detail : 'Error submitting transaction');
//         console.error('Error submitting transaction:', error.response ? error.response.data : error.message);
//     }
// };

//   const handleContinue = () => {
//     router.push('TransactionType/WalletTransactionInterface'); // Update this route as needed
//   };
//   const settinghandleBackClick = () => {
//         setShowLoader(true);
//         setTimeout(() => {
//         router.push('/TransactionType/WalletTransactionInterface');
//         setShowLoader(false); 
//         }, 2000);
//     // router.push('/WalletTransactionInterface');
//   };
//   return (
//     <div className="address-based-transaction-form-container">
//       {showLoader && (
//                 <div className="loaderContainer">
//                     <div className="loader"></div>
//                 </div>
//             )}
//       {alertMessage && (
//         <div className="customAlert">
//           <p>{alertMessage}</p>
//           <button onClick={() => setAlertMessage('')} className="closeButton">OK</button>
//         </div>
//       )}
//       <form className="address-based-transaction-form" onSubmit={handleSubmit}>
//         <div className='back_container'>
//           <ArrowBackIcon className="setting_back_icon" onClick={settinghandleBackClick} />
//           <h2 className="form-heading">Fiat Wallet Transaction</h2>
//         </div>
        
//         <div className="form-group">
//           <label htmlFor="transactionCurrency">Currency:</label>
//           <select
//             id="transactionCurrency"
//             value={transactionCurrency}
//             onChange={(e) => setTransactionCurrency(e.target.value)}
//             required
//           >
//             <option value="">Select a currency</option>
//             {currencies.map((currency) => (
//               <option key={currency.code} value={currency.code}>
//                 {currency.name} ({currency.code})
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="transactionAmount">Amount:</label>
//           <input
//             type="number"
//             id="transactionAmount"
//             value={transactionAmount}
//             onChange={(e) => setTransactionAmount(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="fiatAddress">Fiat Address:</label>
//           <input
//             type="text"
//             id="fiatAddress"
//             value={fiatAddress}
//             onChange={(e) => setFiatAddress(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" disabled={loading} className='button_class'>
//           {loading ? 'Processing...' : 'Transfer'}
//         </button>
//       </form>
//     </div>
//   );
// };
// export default AddressBasedTransactionForm;






'use client';
import { v4 as uuidv4 } from 'uuid'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddressBasedTransactionForm.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface Currency {
  code: string;
  name: string;
}

const AddressBasedTransactionForm: React.FC = () => {
  const [transactionAmount, setTransactionAmount] = useState<string>('');
  const [transactionCurrency, setTransactionCurrency] = useState<string>('');
  const [fiatAddress, setFiatAddress] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const userId = 'DupC0001';

  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
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
    console.log(userId);

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

  const currencies: Currency[] = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'EUR', name: 'Euro' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'JPY', name: 'Japanese Yen' },
  ];

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isNaN(Number(transactionAmount)) || Number(transactionAmount) <= 0) {
        setAlertMessage('Enter a valid amount');
        return;
    }
    if (!transactionCurrency) {
        setAlertMessage('Select a valid currency');
        return;
    }
    if (!fiatAddress) {
        setAlertMessage('Enter a valid fiat address');
        return;
    }

    try {
        const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/validate-transaction/', {
            transaction_amount: transactionAmount,
            transaction_currency: transactionCurrency,
            fiat_address: fiatAddress,
            transaction_method: 'fiat address transaction',
            user_id: userId,
        });

        if (response.data.status === 'address_failure') {
            setAlertMessage('Entered fiat address does not exist.');
        } else if (response.data.status === 'currency_failure') {
            setAlertMessage('Selected currency not found in the wallet.');
        } else if (response.data.status === 'failure') {
            setAlertMessage('Insufficient funds for the transaction.');
        } else {
            const paymentSuccess = await initiateRazorpayPayment(transactionAmount, transactionCurrency);

            if (paymentSuccess) {
                try {
                    await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/address-transfer/', {
                        transaction_amount: transactionAmount,
                        transaction_currency: transactionCurrency,
                        transaction_type: 'Transfer',
                        fiat_address: fiatAddress,
                        transaction_status: 'Success',
                        transaction_fee: 0.0,
                        transaction_hash: uuidv4(),
                        transaction_method: 'fiat address transaction',
                        user_id: userId,
                    });
                    setAlertMessage('Transaction successful!');
                    setTransactionAmount('');
                    setTransactionCurrency('');
                    setFiatAddress('');
                    window.location.href = '/Userauthorization/Dashboard';
                } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                        setAlertMessage('Error storing transaction data.');
                        console.error('Error storing transaction data:', error.response?.data ?? error.message);
                    } else {
                        setAlertMessage('An unknown error occurred.');
                        console.error('Unknown error:', error);
                    }
                }
            } else {
                setAlertMessage('Payment failed!');
            }
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            setAlertMessage(error.response?.data?.detail ?? 'Error submitting transaction');
            console.error('Error submitting transaction:', error.response?.data ?? error.message);
        } else {
            setAlertMessage('An unknown error occurred during submission.');
            console.error('Unknown error:', error);
        }
    }
};


  const handleContinue = () => {
    router.push('TransactionType/WalletTransactionInterface');
  };

  const settinghandleBackClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      router.push('/TransactionType/WalletTransactionInterface');
      setShowLoader(false);
    }, 2000);
  };

  return (
    <div className="address-based-transaction-form-container">
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
      <form className="address-based-transaction-form" onSubmit={handleSubmit}>
        <div className='back_container'>
          <ArrowBackIcon className="setting_back_icon" onClick={settinghandleBackClick} />
          <h2 className="form-heading">Fiat Wallet Transaction</h2>
        </div>
        <div className="form-group">
          <label htmlFor="transactionCurrency">Currency:</label>
          <select
            id="transactionCurrency"
            value={transactionCurrency}
            onChange={(e) => setTransactionCurrency(e.target.value)}
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
        <div className="form-group">
          <label htmlFor="transactionAmount">Amount:</label>
          <input
            type="number"
            id="transactionAmount"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="fiatAddress">Fiat Address:</label>
          <input
            type="text"
            id="fiatAddress"
            value={fiatAddress}
            onChange={(e) => setFiatAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className='button_class'>
          {loading ? 'Processing...' : 'Transfer'}
        </button>
      </form>
    </div>
  );
};

export default AddressBasedTransactionForm;
