import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './WithdrawForm.module.css';
import { v4 as uuidv4 } from 'uuid';

// Custom hook for protected routing
const useAuth = () => {
    // Replace this with your actual authentication logic
    const isAuthenticated = true; // Example: Fetch from global state or context
    const userRole = 'user'; // Example: Fetch user role

    return { isAuthenticated, userRole };
};

const WithdrawForm = () => {
    const router = useRouter();
    const { isAuthenticated, userRole } = useAuth();
    const [balances, setBalances] = useState({ INR: 0.00, USD: 0.00, GBP: 0.00, EUR: 0.00, AUD: 0.00, CAD: 0.00 });
    const [amount, setAmount] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState({ value: 'INR', label: 'INR' });
    const [selectedBank, setSelectedBank] = useState(null);
    const [banks, setBanks] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pendingAmount, setPendingAmount] = useState(null);
    const [isOkButtonDisabled, setIsOkButtonDisabled] = useState(false);
    const [walletDetails, setWalletDetails] = useState(null);
    const [showForm, setShowForm] = useState(true);
    const [showLoader, setShowLoader] = useState(true);

    // Currency symbols mapping
    const currencySymbols = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
    };

    // Protected routing logic
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('Userauthentication/login'); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router]);

    // Lazy loading for Razorpay script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    useEffect(() => {
        // Delay showing the form
        const timer = setTimeout(() => {
            setShowLoader(false);
            setShowForm(true);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const walletResponse = await axios.get('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/fiat_wallets/Wa0000000001/');
                setWalletDetails(walletResponse.data);

                const userCurrenciesResponse = await axios.get('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/user_currencies/?wallet_id=Wa0000000001');
                const newBalances = {};
                userCurrenciesResponse.data.forEach(currency => {
                    newBalances[currency.currency_type] = parseFloat(currency.balance);
                });
                setBalances(prevBalances => ({ ...prevBalances, ...newBalances }));

                const currenciesResponse = await axios.get('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/currencies/');
                setCurrencies(currenciesResponse.data);

                const banksResponse = await axios.get('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/banks/');
                setBanks(banksResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setAlertMessage('Failed to fetch data. Please try again later.');
            }
        };

        fetchInitialData();
    }, []);
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

        // if (submitted) {
        //     setError('');
        // }
    };

    const handleCurrencyChange = (option) => setSelectedCurrency(option);
    const handleBankChange = (option) => setSelectedBank(option);

    const initiateRazorpayPayment = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                const options = {
                    key: 'rzp_test_41ch2lqayiGZ9X', 
                    amount: parseFloat(amount) * 100,
                    currency: currencies,
                    name: 'DUPAY',
                    description: 'Payment for currency conversion',
                    handler: function (response) {
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
                        ondismiss: function() {
                            resolve(false);
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                setAlertMessage("Razorpay script not loaded.");
                resolve(false);
            }
        });
    };

    const handleWithdraw = async () => {
        if (loading) return;
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

        

        if (parsedAmount > balances[selectedCurrency.value]) {
            setAlertMessage('Insufficient balance.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setShowForm(false);

        if (selectedCurrency.value === 'INR') {
            setShowForm(false);
            const paymentSuccess = await initiateRazorpayPayment();
            if (paymentSuccess) {
                setBalances(prevBalances => ({
                    ...prevBalances,
                    [selectedCurrency.value]: prevBalances[selectedCurrency.value] - parsedAmount
                }));
                axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/transactions/', {
                    wallet_id:walletDetails.fiat_wallet_id,
                    transaction_amount:parsedAmount,
                    transaction_currency: selectedCurrency.value,
                    transaction_type: 'withdrawn',
                    fiat_address: walletDetails.fiat_wallet_address,
                    transaction_status: 'Success',
                    transaction_fee: 0.0,
                    transaction_hash: uuidv4(),
                    transaction_method: 'wallet-withdraw',
                    sender_mobile_number:walletDetails.fiat_wallet_phone_number,
                    user_phone_number:walletDetails.fiat_wallet_phone_number
                  })
                  .then((error)=>{
                        console.log(error);
                  });
                setPendingAmount(parsedAmount);
                setAlertMessage('Withdrawn successful');
                setShowForm(true);
                setLoading(false);
                
            } else {
                setShowForm(true);
                setAlertMessage('Payment failed or was cancelled.');
                setLoading(false);
            }
        } else {
            setShowForm(true);
            setBalances(prevBalances => ({
                ...prevBalances,
                [selectedCurrency.value]: prevBalances[selectedCurrency.value] - parsedAmount
            }));
            axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/transactions/', {
                        wallet_id:walletDetails.fiat_wallet_id,
                        transaction_amount:parsedAmount,
                        transaction_currency: selectedCurrency.value,
                        transaction_type: 'withdrawn',
                        fiat_address: walletDetails.fiat_wallet_address,
                        transaction_status: 'Success',
                        transaction_fee: 0.0,
                        transaction_hash: uuidv4(),
                        transaction_method: 'wallet-withdraw',
                        sender_mobile_number:walletDetails.fiat_wallet_phone_number,
                        user_phone_number:walletDetails.fiat_wallet_phone_number
                      });

            setPendingAmount(parsedAmount);
            setAlertMessage('Withdrawn successful');
            // setLoading(false);
        }

        // setLoading(false);
    };

    const handleLeftArrowClick = () => {
        window.location.href = '/Userauthorization/Dashboard'; 
    };

    const handleCloseAlert = () => {
        if (pendingAmount !== null && !isOkButtonDisabled) {
            setIsOkButtonDisabled(true);

            axios.post('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/user_currencies/withdraw/', {
                wallet_id: 'Wa0000000001',
                currency_type: selectedCurrency.value,
                amount: pendingAmount
            })
            .then(response => {
                const { user_currency_balance } = response.data;
                setBalances(prevBalances => ({
                    ...prevBalances,
                    [selectedCurrency.value]: user_currency_balance
                }));
                setAmount('');
                setPendingAmount(null);
                setAlertMessage('');
                
            })
            .catch(error => {
                setShowForm(true);
                console.error('Error withdrawing amount:', error);
                setAlertMessage('Failed to withdraw the amount. Please try again.');
                
            })
            .finally(() => {
                setIsOkButtonDisabled(false);
            });
        } else {
            setAlertMessage('');
            setPendingAmount(null);
        }
    };
    const customSelectStyles = {
        control: (base) => ({ ...base, backgroundColor: '#2a2a2a', borderColor: '#555', color: 'white' }),
        menu: (base) => ({ ...base, backgroundColor: '#2a2a2a' }),
        singleValue: (base) => ({ ...base, color: 'white' }),
        option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#777' : '#2a2a2a', color: 'white' }),
    };

    return (
        <div>
            {alertMessage && (
            <div className={styles.customAlert}>
                <p>{alertMessage}</p>
                <button 
                    onClick={handleCloseAlert} 
                    className={styles.closeButton} 
                    disabled={pendingAmount !== null && isOkButtonDisabled}
                >
                    OK
                </button>

            </div>
            
            )}
            {showForm && (

        <div className={styles.container}>
            {showLoader && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
           <div className={styles.topBar}>
                <button className={styles.topBarButton}>
                    <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick}/>
                </button>
                <h2 className={styles.topBarTitle}>Withdraw</h2>
            </div>
            <Suspense fallback={<div>Loading form...</div>}>
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
                    options={currencies.map(currency => ({
                        value: currency.currency_code,
                        label: (
                            <div className={styles.currencyOption}>
                                <img src={currency.currency_icon} alt={currency.currency_code} className={styles.currencyIcon} />
                                {currency.currency_code} - {currency.currency_country}
                            </div>
                        ),
                    }))}
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                    styles={customSelectStyles}
                />
                <label className={styles.label}>Enter Amount:</label>
                <input
                    type="text"
                    className={styles.input}
                    value={amount}
                    onChange={handleAmountChange}
                />
                <label className={styles.label}>Choose Bank Account:</label>
                <Select
                    options={banks.map(bank => ({
                        value: bank.id,
                        label: (
                            <div className={styles.bankOption}>
                                <img src={bank.bank_icon} alt={bank.bank_name} className={styles.bankIcon} />
                                {bank.bank_name}
                            </div>
                        ),
                    }))}
                    value={selectedBank}
                    onChange={handleBankChange}
                    styles={customSelectStyles}
                />
                <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleWithdraw}
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

export default WithdrawForm;
