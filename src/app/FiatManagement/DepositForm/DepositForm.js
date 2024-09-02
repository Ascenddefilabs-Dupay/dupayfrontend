import React, { useState, useEffect, Suspense } from 'react';
import styles from './DepositForm.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select';


const RAZORPAY_KEY = 'rzp_test_41ch2lqayiGZ9X'; // Replace with actual key
const API_BASE_URL = 'https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi'; // Base URL for all API requests

const DepositForm = () => {
    const [balances, setBalances] = useState({});
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState({ value: 'INR', label: 'INR' });
    const [selectedBank, setSelectedBank] = useState(null);
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [banks, setBanks] = useState([]);
    const [walletDetails, setWalletDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [pendingAmount, setPendingAmount] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    
    

    // Error boundary for API calls
    const handleApiError = (error, context) => {
        console.error(`Error during ${context}:`, error);
        setError(`An error occurred while ${context.toLowerCase()}. Please try again.`);
        setLoading(false);
        setShowForm(true);
    };

    const bankOptions = banks.map(bank => ({
        value: bank.id,
        label: (
            <div className={styles.bankOption}>
                <img src={bank.bank_icon} alt={bank.bank_name} className={styles.bankIcon} />
                {bank.bank_name}
            </div>
        ),
    }));

    const currencyOptions = currencies.map(currency => ({
        value: currency.currency_code,
        label: (
            <div className={styles.currencyOption}>
                <img src={currency.currency_icon} alt={currency.currency_code} className={styles.currencyIcon} />
                {currency.currency_code} - {currency.currency_country}
            </div>
        ),

    }));
    

    const handleBankChange = (selectedOption) => {
        setSelectedBank(selectedOption);
    };

    const handleCurrencyChange = (option) => {
        setSelectedCurrency(option);
    };

    const handleAmountChange = (e) => {
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


    // Currency symbols mapping
    const currencySymbols = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
    };

    const customSelectStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: '#2a2a2a',
            borderColor: '#555',
            color: 'white',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#2a2a2a',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'white',
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#777' : '#2a2a2a',
            color: 'white',
        }),
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
            setShowForm(true);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Load Razorpay script lazily
        const loadRazorpayScript = () => {
            if (!window.Razorpay) {
                const script = document.createElement('script');
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
            axios.get(`${API_BASE_URL}/fiat_wallets/Wa0000000001/`)
                .then(response => setWalletDetails(response.data))
                .catch(error => handleApiError(error, 'fetching wallet details'));

            axios.get(`${API_BASE_URL}/currencies/`)
                .then(response => setCurrencies(response.data))
                .catch(error => handleApiError(error, 'fetching currencies'));

            axios.get(`${API_BASE_URL}/banks/`)
                .then(response => setBanks(response.data))
                .catch(error => handleApiError(error, 'fetching banks'));
        }
    }, [showForm]);

    useEffect(() => {
        if (walletDetails) {
            axios.get(`${API_BASE_URL}/user_currencies/?wallet_id=${walletDetails.fiat_wallet_id}`)
                .then(response => {
                    const userCurrencies = response.data.reduce((acc, currency) => {
                        acc[currency.currency_type] = parseFloat(currency.balance);
                        return acc;
                    }, {});
                    setBalances(userCurrencies);
                })
                .catch(error => handleApiError(error, 'fetching user currencies'));
        }
    }, [walletDetails, selectedCurrency]);

    const initiateRazorpayPayment = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                const options = {
                    key: RAZORPAY_KEY,
                    amount: parseFloat(amount) * 100,
                    currency: selectedCurrency.value,
                    name: 'DUPAY',
                    description: 'Payment for currency conversion',
                    handler: (response) => {
                        setAlertMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
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
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                setAlertMessage("Razorpay script not loaded.");
                resolve(false);
            }
        });
    };

    const handleDeposit = async () => {
        setSubmitted(true);
        const parsedAmount = parseFloat(amount);

        // Clear any previous alert message
        setAlertMessage('');
    
        if (!selectedCurrency) {
            setAlertMessage('Please select a currency.');
            return;
        }

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setAlertMessage('Please enter a valid amount greater than zero.');
            return;
        }

        if (!selectedBank) {
            setAlertMessage('Please select a bank account.');
            return;
        }

        if (!walletDetails) {
            setAlertMessage('Wallet details not loaded.');
            return;
        }

        setLoading(true);
        setShowForm(false);

        if (selectedCurrency.value === 'INR') {
            const paymentSuccess = await initiateRazorpayPayment();

            if (paymentSuccess) {
                const depositData = {
                    wallet_id: walletDetails.fiat_wallet_id,
                    currency_type: selectedCurrency.value,
                    amount: parsedAmount,
                };
                axios.post(`${API_BASE_URL}/user_currencies/create_or_update/`, depositData)
                    .then(() => {
                        axios.post(`${API_BASE_URL}/transactions/`, {
                            wallet_id: walletDetails.fiat_wallet_id,
                            transaction_amount: parsedAmount,
                            transaction_currency: selectedCurrency.value,
                            transaction_type: 'deposited',
                            fiat_address: walletDetails.fiat_wallet_address,
                            transaction_status: 'Success',
                            transaction_fee: 0.0,
                            transaction_hash: uuidv4(),
                            transaction_method: 'wallet-deposit',
                            sender_mobile_number: walletDetails.fiat_wallet_phone_number,
                            user_phone_number: walletDetails.fiat_wallet_phone_number,
                        });
                        setAmount('');
                        setError('');
                        setSubmitted(false);
                        setLoading(false);
                        setShowForm(true);
                    })
                    .catch(error => handleApiError(error, 'processing the deposit'));
            } else {
                setAlertMessage('Payment failed or was cancelled.');
            }
            setShowForm(true);
        }else {
            setShowForm(true);
            // Prepare data for the API call
            const depositData = {
                wallet_id: walletDetails.fiat_wallet_id,
                currency_type: selectedCurrency.value,
                amount: parsedAmount,
            };
            // if(selectedCurrency.value==='fiat_wallet_currency')
            // axios.put(http://localhost:8000/fiatmanagement/fiat_wallets/${walletDetails.fiat_wallet_id}/, {
            //     ...walletDetails,
            //     fiat_wallet_balance: parsedAmount,
            // })
   
            // Make the API call to update UserCurrency
            axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/user_currencies/create_or_update/', depositData)
                .then(response => {
                    setPendingAmount(parsedAmount);
                    setAlertMessage('Deposit successful!');
                    setBalances(prevBalances => ({
                        ...prevBalances,
                        [selectedCurrency.value]: (prevBalances[selectedCurrency.value] || 0) + parsedAmount
                    }));

                    axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/transactions/', {
                        wallet_id:walletDetails.fiat_wallet_id,
                        transaction_amount:parsedAmount,
                        transaction_currency: selectedCurrency.value,
                        transaction_type: 'deposited',
                        fiat_address: walletDetails.fiat_wallet_address,
                        transaction_status: 'Success',
                        transaction_fee: 0.0,
                        transaction_hash: uuidv4(),
                        transaction_method: 'wallet-deposit',
                        sender_mobile_number:walletDetails.fiat_wallet_phone_number,
                        user_phone_number:walletDetails.fiat_wallet_phone_number
                      });

                    setAmount('');
                    setError('');
                    setSubmitted(false);
                    setLoading(false);
                    setShowForm(true);
                })
                .catch(error => handleApiError(error, 'processing the deposit'));
        }
    };

    const handleLeftArrowClick = () => {
        setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false); 
    }, 1000); 
    };

    const handleCloseAlert = () => {
        if (pendingAmount !== null && selectedCurrency.value === 'INR') {
            const newBalance = parseFloat(walletDetails.fiat_wallet_balance) + pendingAmount;
            axios.put(`${API_BASE_URL}/fiat_wallets/${walletDetails.fiat_wallet_id}/`, {
                ...walletDetails,
                fiat_wallet_balance: newBalance,
            })
                .then(() => {
                    setBalances(prevBalances => ({
                        ...prevBalances,
                        [selectedCurrency.value]: (prevBalances[selectedCurrency.value] || 0) + pendingAmount,
                    }));
                    document.location.reload();
                    setAmount('');
                    setError('');
                    setSubmitted(false);
                    setPendingAmount(null);
                    setLoading(false);
                    document.location.reload();
                })
                .catch(error => handleApiError(error, 'updating balance'));
        }
        setAlertMessage('');
        setLoading(false);
        setSubmitted(false);
    };

    return (
        
        <div>
            
            {alertMessage && (
            <div className={styles.customAlert}>
                <p>{alertMessage}</p>
                <button onClick={handleCloseAlert} className={styles.closeButton}>OK</button>
            </div>
        )}
            {showForm && (
                
                <div className={styles.container}>
                    {showLoader && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
                    <Suspense fallback={<div>Loading...</div>}>
                    <div className={styles.topBar}>
                        <button className={styles.topBarButton}>
                            <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
                        </button>
                        <h2 className={styles.topBarTitle}>Deposit</h2>
                    </div>
                    
                    <div className={styles.cardContainer}>
                        <div className={styles.balanceCard}>
                            <div className={styles.currencyInfo}>
                                <img
                                    src={currencies.find(currency => currency.currency_code === selectedCurrency.value)?.currency_icon || ''}
                                    alt={selectedCurrency.value}
                                    className={styles.currencyIconInCard}
                                />
                                <h3 className={styles.currency}>
                                    {selectedCurrency.value}
                                    <span className={styles.country}>
                                        {currencies.find(currency => currency.currency_code === selectedCurrency.value)?.currency_country || ''}
                                    </span>
                                </h3>
                            </div>

                            {/* <p className={styles.balanceLabel}>Balance:</p> */}
                            <p className={styles.balanceAmount}>
                                {currencySymbols[selectedCurrency.value] || ''}{' '}
                                {balances[selectedCurrency.value]?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </div>

                    <div className={styles.form}>
                        <label className={styles.label}>Choose Currency:</label>
                        <Select
                            options={currencyOptions}
                            value={selectedCurrency}
                            onChange={handleCurrencyChange}
                            className={styles.select}
                            styles={customSelectStyles}
                        />
                        <label className={styles.label}>Enter Amount:</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        {submitted && error && <p className={styles.error}>{error}</p>}

                        <label className={styles.label}>Choose Bank Account:</label>
                        <Select
                            options={bankOptions}
                            value={selectedBank}
                            onChange={handleBankChange}
                            className={styles.select}
                            styles={customSelectStyles}
                        />

                        <button
                            type="button"
                            className={styles.submitButton}
                            onClick={handleDeposit}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'SUBMIT'}
                        </button>
                    </div>
                    </Suspense>
                </div>
                
                 )}

    </div>
    
    );
};

export default DepositForm;
