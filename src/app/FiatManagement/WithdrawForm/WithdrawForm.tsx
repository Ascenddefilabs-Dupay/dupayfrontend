"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Select, { SingleValue, StylesConfig } from 'react-select';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './WithdrawForm.module.css';
import { v4 as uuidv4 } from 'uuid';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

// Types for data structures
interface Currency {
    // currency_code: string;
    // currency_country: string;
    // currency_icon: string;
    currency_type:string;
}

interface Bank {
    id: string;
    bank_name: string;
    bank_icon: string;
}

interface WalletDetails {
    fiat_wallet_id: string;
    fiat_wallet_address: string;
    fiat_wallet_balance: string;
    fiat_wallet_phone_number: string;
}
interface OptionType {
    value: string;
    label: JSX.Element | string;
}

// Custom hook for protected routing
const useAuth = () => {
    const isAuthenticated = true;
    const userRole = 'user';

    return { isAuthenticated, userRole };
};

const WithdrawForm: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [balances, setBalances] = useState<Record<string, number>>({
        INR: 0.00,
        USD: 0.00,
        GBP: 0.00,
        EUR: 0.00,
        AUD: 0.00,
        CAD: 0.00
    });
    const [amount, setAmount] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<OptionType>({ value: 'INR', label: 'INR' });
    const [selectedBank, setSelectedBank] = useState<OptionType | null>(null);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [error, setError] = useState<string>('');
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [pendingAmount, setPendingAmount] = useState<number | null>(null);
    const [isOkButtonDisabled, setIsOkButtonDisabled] = useState<boolean>(false);
    const [walletDetails, setWalletDetails] = useState<WalletDetails | null>(null);
    const [showForm, setShowForm] = useState<boolean>(true);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const { isLoggedIn } = UseSession();
    interface CurrencyOption {
      value: string;
      label: JSX.Element;
  }
  
  interface BankOption {
      value: string;
      label: JSX.Element;
  }
  interface UserCurrency {
    currency_type: string;
    balance: string;
}
  const handleApiError = (error: any, context: string) => {
    console.error(`Error during ${context}:`, error);
    setError(`An error occurred while ${context.toLowerCase()}. Please try again.`);
    setLoading(false);
    setShowForm(true);
};

useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   const sessionDataString = window.localStorage.getItem('session_data');
    //   if (sessionDataString) {
    //     const sessionData = JSON.parse(sessionDataString);
    //     const storedUserId = sessionData.user_id;
    //     // setUserId(storedUserId);
    //     console.log(storedUserId);
    //     console.log(sessionData.user_email);
 
    //   } else {
    //     router.push('http://localhost:3000/Userauthentication/SignIn')
    //   }
    // }
  }, []);

    const currencySymbols: Record<string, string> = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
        AUS:'A$',
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/Userauthentication/SignIn');
        }
    }, [isAuthenticated, router]);

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
        const timer = setTimeout(() => {
            setShowLoader(false);
            setShowForm(true);
        }, 2000); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        
            axios
                .get(`http://127.0.0.1:8000/fiatmanagementapi/fiat_wallets/Wa0000000002/`)
                .then((response) => setWalletDetails(response.data))
                .catch((error) => handleApiError(error, 'fetching wallet details'));

            axios
                .get(`http://127.0.0.1:8000/fiatmanagementapi/account-types/`)
                .then((response) => setCurrencies(response.data))
                .catch((error) => handleApiError(error, 'fetching currencies'));

            axios
                .get(`http://127.0.0.1:8000/fiatmanagementapi/banks/`)
                .then((response) => setBanks(response.data))
                .catch((error) => handleApiError(error, 'fetching banks'));
        
    }, []);
    useEffect(() => {
        if (walletDetails) {
            axios
                .get(`http://127.0.0.1:8000/fiatmanagementapi/user_currencies/?wallet_id=${walletDetails.fiat_wallet_id}`)
                .then((response) => {
                    const userCurrencies = response.data.reduce((acc: { [key: string]: number }, currency: UserCurrency) => {
                        acc[currency.currency_type] = parseFloat(currency.balance);
                        return acc;
                    }, {});
                    setBalances(userCurrencies);
                })
                .catch((error) => handleApiError(error, 'fetching user currencies'));
        }
    }, [walletDetails, selectedCurrency]);

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
    };

    const handleCurrencyChange = (option: SingleValue<OptionType>) => {
        if (option) setSelectedCurrency(option);
    };

    const handleBankChange = (option: SingleValue<OptionType>) => {
        if (option) setSelectedBank(option);
    };
    const bankOptions: BankOption[] = banks.map((bank) => ({
      value: bank.id,
      label: (
          <div className={styles.bankOption}>
              <img src={bank.bank_icon} alt={bank.bank_name} className={styles.bankIcon} />
              {bank.bank_name}
          </div>
      ),
  }));

  const currencyOptions: CurrencyOption[] = currencies.map((currency) => ({
      value: currency.currency_type,
      label: (
          <div className={styles.currencyOption}>
              {/* <img src={currency.currency_icon} alt={currency.currency_code} className={styles.currencyIcon} /> */}
              {currency.currency_type}
          </div>
      ),
  }));

    const customSelectStyles = {
      control: (base: any) => ({
          ...base,
          backgroundColor: '#2a2a2a',
          borderColor: '#555',
          color: 'white',
      }),
      menu: (base: any) => ({
          ...base,
          backgroundColor: '#2a2a2a',
      }),
      singleValue: (base: any) => ({
          ...base,
          color: 'white',
      }),
      option: (base: any, state: any) => ({
          ...base,
          backgroundColor: state.isFocused ? '#777' : '#2a2a2a',
          color: 'white',
      }),
  };

    const initiateRazorpayPayment = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                const options = {
                    key: 'rzp_test_41ch2lqayiGZ9X',
                    amount: parseFloat(amount) * 100,
                    currency: selectedCurrency.value,
                    name: 'DUPAY',
                    description: 'Payment for currency conversion',
                    handler: (response: any) => {
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
                        ondismiss: function () {
                            resolve(false);
                        },
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

    const handleWithdraw = async () => {
        if (loading) return;

        const parsedAmount = parseFloat(amount);
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
            return;
        }

        setLoading(true);
        setShowForm(false);

        try {
            if (selectedCurrency.value ) {
                const paymentSuccess = await initiateRazorpayPayment();
                setShowForm(true); 
                if (!paymentSuccess) {
                    setAlertMessage('Payment failed or was cancelled.');
                    setShowForm(true);
                    setLoading(false);
                    return;
                }
            
    
            const withdrawData = {
                wallet_id: walletDetails.fiat_wallet_id,
                currency_type: selectedCurrency.value,
                amount: parsedAmount,
            };
    
            // Make the API call to update UserCurrency
            await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/user_currencies/withdraw/', withdrawData);
            setPendingAmount(parsedAmount);
            // setAlertMessage('Deposit successful!');
                setBalances(prevBalances => ({
                    ...prevBalances,
                    [selectedCurrency.value]: (prevBalances[selectedCurrency.value] || 0) - parsedAmount
                }));
            // Record the transaction
            await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/transactions/', {
                wallet_id: walletDetails.fiat_wallet_id,
                transaction_amount: parsedAmount,
                transaction_currency: selectedCurrency.value,
                transaction_type: 'withdrawn',
                fiat_address: walletDetails.fiat_wallet_address,
                transaction_status: 'Success',
                transaction_fee: 0.0,
                transaction_hash: uuidv4(),
                transaction_method: 'wallet-withdraw',
                sender_mobile_number: walletDetails.fiat_wallet_phone_number,
                user_phone_number: walletDetails.fiat_wallet_phone_number,
            });
    
            // Update local balances and reset form
            // setBalances(prevBalances => ({
            //     ...prevBalances,
            //     [selectedCurrency.value]: (prevBalances[selectedCurrency.value] || 0) - parsedAmount,
            // }));
            setAmount('');
            setError('');
            // setSubmitted(false);
            setPendingAmount(null);
            setLoading(false);
            setShowForm(true); 
        }
       } catch (error) {
            setAlertMessage('An error occurred while processing the deposit.');
            console.error('Error depositing amount:', error);
            setLoading(false);
            setShowForm(true);
        }
  
          };

    const handleLeftArrowClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            router.back();
            setShowLoader(false);
        }, 3000);
    };
    const handleCloseAlert = async () => {
        if (pendingAmount !== null && selectedCurrency.value === 'INR') {
            const newBalance = parseFloat(walletDetails!.fiat_wallet_balance) - pendingAmount;
    
            axios.put(`https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/fiat_wallets/${walletDetails!.fiat_wallet_id}/`, {
                ...walletDetails,
                fiat_wallet_balance: newBalance,
            })
            .then(() => {
                setBalances(prevBalances => ({
                    ...prevBalances,
                    [selectedCurrency.value]: newBalance,
                }));
                setAmount('');
                setError('');
                // setSubmitted(false);
                setPendingAmount(null);
                setLoading(false);
                document.location.reload();
            })
            .catch(error => {
                setError('An error occurred while updating the balance.');
                console.error('Error updating balance:', error);
            });
        } else {
            setAlertMessage('');
            setLoading(false);
            // setSubmitted(false);
        }
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
                      <h2 className={styles.topBarTitle}>Withdraw</h2>
                  </div>
                  
                  <div className={styles.cardContainer}>
                      <div className={styles.balanceCard}>
                          <div className={styles.currencyInfo}>
                              {/* <img
                                  src={currencies.find(currency => currency.currency_code === selectedCurrency.value)?.currency_icon || ''}
                                  alt={selectedCurrency.value}
                                  className={styles.currencyIconInCard}
                              /> */}
                              <h3 className={styles.currency}>
                                  {selectedCurrency.value}
                                  {/* <span className={styles.country}>
                                      {currencies.find(currency => currency.currency_code === selectedCurrency.value)?.currency_country || ''}
                                  </span> */}
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
                      {/* {submitted && error && <p className={styles.error}>{error}</p>} */}

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
