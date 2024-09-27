// import React, { useState, useEffect } from 'react';
// import '../WalletTransactions/WalletTransactions.css'; // Ensure you have the correct path to your CSS file
// import axios from 'axios';
// import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
// import { QrReader } from 'react-qr-reader';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
// import { useRouter } from 'next/navigation';

// const CurrencyForm = () => {
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [amount, setAmount] = useState('');
//     const [currency, setCurrency] = useState('');
//     const [message, setMessage] = useState(''); // State to store the success message
//     const [alertMessage, setAlertMessage] = useState(''); 
//     const router = useRouter();
//     const [showLoader, setShowLoader] = useState(false);

//     useEffect(() => {
//         // Load Razorpay script
//         const script = document.createElement('script');
//         script.src = "https://checkout.razorpay.com/v1/checkout.js";
//         script.async = true;
//         document.body.appendChild(script);

//         // Cleanup the script when component unmounts
//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     const currencies = [
//         { code: 'USD', name: 'United States Dollar' },
//         { code: 'GBP', name: 'British Pound' },
//         { code: 'EUR', name: 'Euro' },
//         { code: 'INR', name: 'Indian Rupee' },
//         { code: 'JPY', name: 'Japanese Yen' },
//         // Add more currencies as needed
//     ];

//     const initiateRazorpayPayment = () => {
//         return new Promise((resolve) => {
//             if (window.Razorpay) {
//                 const options = {
//                     key: 'rzp_test_41ch2lqayiGZ9X', // Your Razorpay API Key
//                     amount: parseFloat(amount) * 100, // Amount in paisa
//                     currency: currency,
//                     name: 'DUPAY',
//                     description: 'Payment for currency conversion',
//                     handler: function (response) {
//                         setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
//                         resolve(true); // Resolve true on successful payment

//                     },
//                     prefill: {
//                         name: 'User Name',
//                         email: 'user@example.com',
//                         contact: '9999999999',
//                     },
//                     notes: {
//                         address: 'Your Address',
//                     },
//                     theme: {
//                         color: '#F37254',
//                     },
//                     modal: {
//                         ondismiss: function() {
//                             resolve(false); // Resolve false if payment is cancelled
//                         }
//                     }
//                 };

//                 const rzp1 = new window.Razorpay(options);
//                 rzp1.open();
//             } else {
//                 alert("Razorpay script not loaded.");
//                 resolve(false);
//             }
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Step 1: Client-side validations
//         const mobileRegex = /^[0-9]{10}$/;
//         if (!mobileRegex.test(mobileNumber)) {
//             setAlertMessage('Enter a valid 10-digit mobile number');
//             return;
//         }

//         if (isNaN(amount) || amount <= 0) {
//             setAlertMessage('Enter a valid amount');
//             return;
//         }

//         if (!currency) {
//             setAlertMessage('Select a valid currency');
//             return;
//         }

//         // Step 2: Server-side validation and initiate Razorpay payment only if validation succeeds
//         try {
//             const transactionHash = uuidv4();
//             const validationResponse = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/transaction_validation/', {
//                 transaction_amount: amount,
//                 transaction_currency: currency,
//                 user_phone_number: mobileNumber,
//             });
    
//             if (validationResponse.data.status !== 'success') {
//                 setAlertMessage(validationResponse.data.message);
//                 return;
//             }else{
//                 const paymentSuccess = await initiateRazorpayPayment();
//             if (paymentSuccess) {
//                 await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/wallet_transfer/', {
//                     transaction_type: 'Debit',
//                     transaction_amount: amount,
//                     transaction_currency: currency,
//                     transaction_status: 'Success',
//                     transaction_fee: 0.0,
//                     user_phone_number: mobileNumber,
//                     transaction_hash: transactionHash,
//                 });
//                 setMessage('Transaction successful!', response.data);
//             }

//             }
            
//         } catch (error) {
//             console.log(error.response ? error.response.data.detail : 'Error processing transaction');
//         }
//     };

//     const handleCloseAlert = () => {
//         setAlertMessage('');
//     };

//     const settinghandleBackClick = () => {
//         setShowLoader(true);
//         setTimeout(() => {
//         router.push('/TransactionType/WalletTransactionInterface');
//         setShowLoader(false); 
//         }, 2000);
//     };

//     return (
//         <form className="currency-form" onSubmit={handleSubmit}>
//             {showLoader && (
//                 <div className="loaderContainer">
//                     <div className="loader"></div>
//                 </div>
//             )}
//             <div className="form-group">
//                 {alertMessage && (
//                     <div className="customAlert">
//                         <p>{alertMessage}</p>
//                         <button onClick={handleCloseAlert} className="closeButton">OK</button>
//                     </div>
//                 )}
//                 <div className='back_container'>
//                     <ArrowBackIcon className="setting_back_icon" onClick={settinghandleBackClick} />
//                     <label className="center-label">Wallet Transactions</label>
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="currency">Currency:</label>
//                     <select
//                         id="currency"
//                         value={currency}
//                         onChange={(e) => setCurrency(e.target.value)}
//                         required
//                         className='currency_type'
//                     >
//                         <option value="">Select a currency</option>
//                         {currencies.map((currency) => (
//                             <option key={currency.code} value={currency.code}>
//                                 {currency.name} ({currency.code})
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="amount">Amount:</label>
//                     <input
//                         type="number"
//                         id="amount"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         required
//                         className='currnecy_input'
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="mobileNumber">Mobile Number:</label>
//                     <input
//                         type="text"
//                         id="mobileNumber"
//                         value={mobileNumber}
//                         onChange={(e) => {
//                             const value = e.target.value;
//                             // Only allow digits and limit input to 10 digits
//                             if (/^\d{0,10}$/.test(value)) {
//                                 setMobileNumber(value);
//                             }
//                         }}
//                         required
//                         className='currnecy_input'
//                     />
//                 </div>
//             </div>
//             <button type="submit">Transfer</button>
//             {message && <p>{message}</p>} {/* Display success or error message */}
//         </form>
//     );
// };

// export default CurrencyForm;


'use client'
import React, { useState, useEffect } from 'react';
import '../WalletTransactions/WalletTransactions.css'; // Ensure you have the correct path to your CSS file
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { QrReader } from 'react-qr-reader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
import { useRouter } from 'next/navigation';

// Define a type for the currency object
interface Currency {
    code: string;
    name: string;
}

const CurrencyForm: React.FC = () => {
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<string>('');
    const [message, setMessage] = useState<string>(''); // State to store the success message
    const [alertMessage, setAlertMessage] = useState<string>('');
    const router = useRouter();
    const [showLoader, setShowLoader] = useState<boolean>(false);

    // const userId = 'DupC0004';

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
        // console.log(userId);
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup the script when component unmounts
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
        // Add more currencies as needed
    ];

    const initiateRazorpayPayment = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                const options = {
                    key: 'rzp_test_41ch2lqayiGZ9X', // Your Razorpay API Key
                    amount: parseFloat(amount) * 100, // Amount in paisa
                    currency: currency,
                    name: 'DUPAY',
                    description: 'Payment for currency conversion',
                    handler: function (response: any) {
                        setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                        resolve(true); // Resolve true on successful payment
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
                        ondismiss: function () {
                            resolve(false); // Resolve false if payment is cancelled
                        }
                    }
                };

                const rzp1 = new (window as any).Razorpay(options);
                rzp1.open();
            } else {
                alert("Razorpay script not loaded.");
                resolve(false);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Step 1: Client-side validations
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber)) {
            setAlertMessage('Enter a valid 10-digit mobile number');
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setAlertMessage('Enter a valid amount');
            return;
        }

        if (!currency) {
            setAlertMessage('Select a valid currency');
            return;
        }

        // Step 2: Server-side validation and initiate Razorpay payment only if validation succeeds
        try {
            const transactionHash = uuidv4();
            const validationResponse = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/transaction_validation/', {
                transaction_amount: amount,
                transaction_currency: currency,
                user_phone_number: mobileNumber,
                user_id: userID,
            });
    
            if (validationResponse.data.status !== 'success') {
                setAlertMessage(validationResponse.data.message);
                return;
            } else {
                const paymentSuccess = await initiateRazorpayPayment();
                if (paymentSuccess) {
                    const response = await axios.post('http://transactiontype-ind-255574993735.asia-south1.run.app/transaction_api/wallet_transfer/', {
                        transaction_type: 'Debit',
                        transaction_amount: amount,
                        transaction_currency: currency,
                        transaction_status: 'Success',
                        transaction_fee: 0.0,
                        user_phone_number: mobileNumber,
                        transaction_hash: transactionHash,
                        user_id: userID,
                    });
                    setMessage(`Transaction successful! Transaction ID: ${response.data.transaction_id}`); // Only passing one argument to setMessage
                    window.location.href = '/Userauthorization/Dashboard/Home';
                }
            }
        } catch (error: any) {
            console.log(error.response ? error.response.data.detail : 'Error processing transaction');
        }
    };    

    const handleCloseAlert = () => {
        setAlertMessage('');
    };

    const settinghandleBackClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            router.push('/TransactionType/WalletTransactionInterface');
            setShowLoader(false); 
        }, 2000);
    };

    return (
        <form className="currency-form" onSubmit={handleSubmit}>
            {showLoader && (
                <div className="loaderContainer">
                    <div className="loader"></div>
                </div>
            )}
            <div className="form-group">
                {alertMessage && (
                    <div className="customAlert">
                        <p>{alertMessage}</p>
                        <button onClick={handleCloseAlert} className="closeButton">OK</button>
                    </div>
                )}
                <div className='back_container'>
                    <ArrowBackIcon className="setting_back_icon" onClick={settinghandleBackClick} />
                    <label className="center-label">Wallet Transactions</label>
                </div>
                <div className="form-group">
                    <label htmlFor="currency">Currency:</label>
                    <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                        className='currency_type'
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
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className='currnecy_input'
                    />
                </div>
                <div>
                    <label htmlFor="mobileNumber">Mobile Number:</label>
                    <input
                        type="text"
                        id="mobileNumber"
                        value={mobileNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,10}$/.test(value)) {
                                setMobileNumber(value);
                            }
                        }}
                        required
                        className='currnecy_input'
                    />
                </div>
            </div>
            <button type="submit">Transfer</button>
            {message && <p>{message}</p>} {/* Display success or error message */}
        </form>
    );
};

export default CurrencyForm;
