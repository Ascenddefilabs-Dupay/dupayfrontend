import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Select, { SingleValue } from 'react-select';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './Topup.module.css';

const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X'; // Replace with actual key
// const API_BASE_URL = 'http://localhost:8000/fiatmanagementapi'; // Updated base URL for API requests
const API_BASE_URL = 'https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi'; // Base URL for all API requests
interface CurrencyOption {
  value: string;
  label: string;
}

interface WalletDetails {
  fiat_wallet_id: string;
  fiat_wallet_address: string;
  fiat_wallet_balance: string;
  fiat_wallet_phone_number: string;
}

interface AccountType {
  currency_type: string;
}

interface UserCurrency {
  currency_type: string;
  balance: number;
}

const TopUpForm: React.FC = () => {
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [amount, setAmount] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [accountTypes, setAccountTypes] = useState<CurrencyOption[]>([]);
  const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const router = useRouter();
  const uniqueId = uuidv4();
console.log(uniqueId);
  const handleApiError = (error: any, context: string) => {
    console.error(`Error during ${context}:`, error);
    setError(`An error occurred while ${context.toLowerCase()}. Please try again.`);
    setLoading(false);
    setShowForm(true);
  };

  const handleCurrencyChange = (option: SingleValue<CurrencyOption>) => {
    setSelectedCurrency(option as CurrencyOption);
  };

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

    if (submitted) {
      setError('');
    }
  };

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
    if (showForm) {
      axios
        .get(`${API_BASE_URL}/fiat_wallets/Wa0000000003/`) // Fetch wallet details
        .then((response) => setWalletDetails(response.data))
        .catch((error) => handleApiError(error, 'fetching wallet details'));

      axios
        .get(`${API_BASE_URL}/account-types/`) // Fetch all account types
        .then((response) => {
          const currencyOptions: CurrencyOption[] = response.data.map((account: AccountType) => ({
            value: account.currency_type,
            label: account.currency_type,
          }));
          setAccountTypes(currencyOptions);
        })
        .catch((error) => handleApiError(error, 'fetching account types'));
    }
  }, [showForm]);

  useEffect(() => {
    if (walletDetails) {
      axios
        .get(`${API_BASE_URL}/user_currencies/?wallet_id=${walletDetails.fiat_wallet_id}`)
        .then((response) => {
          if (response.data && Array.isArray(response.data)) {
            const userCurrencies = response.data.reduce((acc: { [key: string]: number }, currency: UserCurrency) => {
              if (currency.currency_type && currency.balance !== undefined && currency.balance !== null) {
                acc[currency.currency_type] = currency.balance;
              }
              return acc;
            }, {});
            setBalances(userCurrencies);
          }
        })
        .catch((error) => handleApiError(error, 'fetching user currencies'));
    }
  }, [walletDetails]);

  const initiateRazorpayPayment = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        const options = {
          key: RAZORPAY_KEY,
          amount: parseFloat(amount) * 100,
          currency: selectedCurrency?.value,
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

  if (!selectedCurrency) {
    setAlertMessage('Please select a currency.');
    return;
  }

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
      currency_code: selectedCurrency.value,
      amount: parsedAmount,
      currency_country: 'YourCountry', // Adjust this value as needed
      transaction_hash: uuidv4(),
    };

    await axios.post(`${API_BASE_URL}/user_currencies/topup/`, topUpData);

    // Update the balance in state after successful top-up
    setBalances(prevBalances => ({
      ...prevBalances,
      [selectedCurrency.value]: (prevBalances[selectedCurrency.value] || 0) + parsedAmount,
    }));

    setAlertMessage('Top-up successful!');
  } catch (error) {
    handleApiError(error, 'processing top-up');
  } finally {
    setLoading(false);
    setShowForm(true);
  }
};

  
  const handleBack = () => {
    router.back();
  };

  return (
    <div className={styles.topUpFormContainer}>
      <button className={styles.backButton} onClick={handleBack}>
        <FaArrowLeft /> TopUp
      </button>
      {loading && <div className={styles.loading}>Processing...</div>}
      {alertMessage && <div className={styles.alert}>{alertMessage}</div>}
      {showForm && (
        <form className={styles.topUpFormContent} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label htmlFor="currencySelect" className={styles.label}>Select Currency</label>
            <Select
              id="currencySelect"
              options={accountTypes}
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              placeholder="Select Currency"
              className={styles.select}
              isClearable
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="amountInput" className={styles.label}>Enter Amount</label>
            <input
              id="amountInput"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter Amount"
              className={styles.amountInput}
            />
          </div>
          <button
            type="button"
            className={styles.topUpButton}
            onClick={handleTopUp}
            disabled={loading}
          >
            Top Up
          </button>
          {error && <div className={styles.error}>{error}</div>}
        </form>
      )}
    </div>
  );
};

export default TopUpForm;
