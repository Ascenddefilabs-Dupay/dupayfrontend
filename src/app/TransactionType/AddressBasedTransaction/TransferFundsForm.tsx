'use client';
import { v4 as uuidv4 } from 'uuid'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddressBasedTransactionForm.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
const TransactionType = process.env.TransactionType

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
        const response = await axios.post(`${TransactionType}/transaction_api/validate-transaction/`, {
            transaction_amount: transactionAmount,
            transaction_currency: transactionCurrency,
            fiat_address: fiatAddress,
            transaction_method: 'fiat address transaction',
            user_id: userID,
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
                    await axios.post(`${TransactionType}/transaction_api/address-transfer/`, {
                        transaction_amount: transactionAmount,
                        transaction_currency: transactionCurrency,
                        transaction_type: 'Transfer',
                        fiat_address: fiatAddress,
                        transaction_status: 'Success',
                        transaction_fee: 0.0,
                        transaction_hash: uuidv4(),
                        transaction_method: 'fiat address transaction',
                        user_id: userID,
                    });
                    setAlertMessage('Transaction successful!');
                    setTransactionAmount('');
                    setTransactionCurrency('');
                    setFiatAddress('');
                    router.push('/Userauthorization/Dashboard/Home'); 
                    // window.location.href = '/Userauthorization/Dashboard/Home';
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
