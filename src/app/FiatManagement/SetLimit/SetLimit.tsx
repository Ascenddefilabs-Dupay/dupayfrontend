import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './SetLimit.module.css';
import axios from 'axios';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

const SetLimit: React.FC = () => {
    const router = useRouter();
    const [amount, setAmount] = useState<string>('');
    const [walletDetails, setWalletDetails] = useState<any>(null);
    const [limitType, setLimitType] = useState<string>('Daily');
    const [alertMessage, setAlertMessage] = useState<string>(''); 
    const [error, setError] = useState<string>(''); 
    const [submitted, setSubmitted] = useState<boolean>(false); 
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const { isLoggedIn } = UseSession();

    useEffect(() => {
        if (!isLoggedIn) {
            // router.push('http://localhost:3000/Userauthentication/SignIn');
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                const response = await axios.get('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/user/DupC0001/');
                setWalletDetails(response.data);
            } catch (error) {
                console.error('Error fetching wallet details:', error);
                setAlertMessage('Error fetching wallet details');
            }
        };

        fetchWalletDetails();
    }, []);

    const handleBackClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            router.back();
            setShowLoader(false); 
        }, 1000); 
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const handleProceedClick = async () => {
        setSubmitted(true);
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setAlertMessage('Please enter a valid amount greater than zero.');
            return;
        }

        if (walletDetails) {
            try {
                const response = await axios.put('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/user/DupC0001/', {
                    ...walletDetails,
                    users_daily_limit: parsedAmount,
                    limit_type: limitType,
                });

                if (response.status === 200) {
                    setAlertMessage('Limit updated successfully');
                    setAmount('');
                    setError('');
                } else {
                    setAlertMessage('Failed to update limit');
                }
            } catch (error) {
                console.error('Error updating limit:', error);
                setAlertMessage('Error updating limit');
            }
        } else {
            setAlertMessage('Wallet details not loaded');
        }
    };

    const handleCloseAlert = () => {
        setAlertMessage('');
    };

    return (
        <div className={styles.container}>
            {alertMessage && (
                <div className={styles.customAlert}>
                    <p>{alertMessage}</p>
                    <button onClick={handleCloseAlert} className={styles.closeButton}>OK</button>
                </div>
            )}
            {showLoader && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleBackClick} /> {/* Back arrow button */}
            </div>
            <div className={styles.amountContainer}>
                <label className={styles.label}>Enter Amount:</label>
                <input
                    type="text"
                    placeholder="Enter the amount"
                    className={styles.input}
                    value={amount}
                    onChange={handleAmountChange}
                />
                {submitted && error && <p className={styles.error}>{error}</p>} {/* Error message */}
            </div>
            <label className={styles.label}>Limit Type:</label>
            <select
                className={styles.select}
                value={limitType}
                onChange={(e) => setLimitType(e.target.value)}
            >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
            <button className={styles.proceedButton} onClick={handleProceedClick}>PROCEED</button>
        </div>
    );
};

export default SetLimit;
