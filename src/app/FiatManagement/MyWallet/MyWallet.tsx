"use client"
import React, { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import Select, { SingleValue } from 'react-select';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSearch } from 'react-icons/fa'; 
import styles from './MyWallet.module.css';

// Define types for currency data and select options
interface Currency {
    currency_code: string;
    currency_country: string;
    currency_icon: string;
    balance?: string;
}

interface CurrencyOption {
    value: string;
    label: JSX.Element;
}

const MyWallet: React.FC = () => {
    const router = useRouter();
    const [showLoader, setShowLoader] = useState(false);

    const [balances, setBalances] = useState<Record<string, number>>({
        INR: 0.00,
        USD: 0.00,
        GBP: 0.00,
        EUR: 0.00,
        AUD: 0.00,
        CAD: 0.00,
    });

    const [alertMessage, setAlertMessage] = useState<string>('');
    const currencySymbols: Record<string, string> = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
        AUD: 'A$',
        CAD: 'C$',
    };

    const [selectedCurrency, setSelectedCurrency] = useState<SingleValue<{ value: string; label: JSX.Element }> | null>({
        value: 'INR',
        label: <div>INR - India</div>,
    });

    const [selectedCountry, setSelectedCountry] = useState<string>('India');
    const [selectedCurrencyImage, setSelectedCurrencyImage] = useState<string>(''); 
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCurrenciesResponse = await axios.get('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/user_currencies/?wallet_id=Wa0000000001');
                const userCurrencies: Currency[] = userCurrenciesResponse.data;
                const updatedBalances: Record<string, number> = {};

                userCurrencies.forEach(currency => {
                    updatedBalances[currency.currency_code] = parseFloat(currency.balance || '0.00');
                });

                setBalances(prevBalances => ({
                    ...prevBalances,
                    ...updatedBalances,
                }));

                const currenciesResponse = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/currencies/');
                const data: Currency[] = await currenciesResponse.json();
                setCurrencies(data);

                const defaultCurrency = data.find(currency => currency.currency_code === 'INR');
                if (defaultCurrency) {
                    setSelectedCurrencyImage(defaultCurrency.currency_icon);
                    setSelectedCountry(defaultCurrency.currency_country);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setAlertMessage('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const selected = currencies.find(currency => currency.currency_code === selectedCurrency?.value);
        if (selected) {
            setSelectedCurrencyImage(selected.currency_icon);
            setSelectedCountry(selected.currency_country);
        }
    }, [selectedCurrency, currencies]);

    const filteredCurrencies = currencies.filter(currency =>
        currency.currency_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        currency.currency_country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currencyOptions: CurrencyOption[] = filteredCurrencies.map(currency => ({
        value: currency.currency_code,
        label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={currency.currency_icon}
                    alt={currency.currency_code}
                    style={{ marginRight: 8, width: 20, height: 20 }}
                />
                {currency.currency_code} - {currency.currency_country}
            </div>
        ),
    }));

    const handleCurrencyChange = (option: SingleValue<CurrencyOption>) => {
        setSelectedCurrency(option);
    };

    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const foundCurrency = filteredCurrencies.find(currency =>
                currency.currency_code.toLowerCase() === searchQuery.toLowerCase() ||
                currency.currency_country.toLowerCase() === searchQuery.toLowerCase()
            );
            if (foundCurrency) {
                setSelectedCurrency({
                    value: foundCurrency.currency_code,
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={foundCurrency.currency_icon}
                                alt={foundCurrency.currency_code}
                                style={{ marginRight: 8, width: 20, height: 20 }}
                            />
                            {foundCurrency.currency_code} - {foundCurrency.currency_country}
                        </div>
                    ),
                });
            } else {
                setAlertMessage('Currency not found.');
            }
        }
    };
    
    const handleSetLimitClick = () => {
        router.push('/FiatManagement/SetLimit');
    };

    const handleTopUpClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            router.push('/FiatManagement/Topup');
            setShowLoader(false);
        }, 2000); // Show loader for 2 seconds
    };

    const handleWithdrawClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            router.push('/FiatManagement/WithdrawForm');
            setShowLoader(false);
        }, 2000); // Show loader for 2 seconds
    };

    const handleLeftArrowClick = () => {
        setShowLoader(true);
        setTimeout(() => {
            window.location.href = '/Userauthorization/Dashboard';
            setShowLoader(false); 
        }, 3000); 
    };

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

    const handleCloseAlert = () => {
        setAlertMessage('');
    };

    return (
        <div className={styles.walletContainer} >
            {showLoader && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
            <div className={styles.header}>
                <FaArrowLeft className={styles.backArrow} onClick={handleLeftArrowClick}/>
                <h2 className={styles.title}>My Wallet</h2>
            </div>
            <div className={styles.balanceCard}>
                <div className={styles.balanceDetails}>
                    <img 
                        src={selectedCurrencyImage} 
                        alt={selectedCurrency?.value} 
                        className={styles.currencyImage} 
                    />
                    <div className={styles.currencyText}>
                        <span className={styles.currencyCode}>{selectedCurrency?.value}</span>
                        <span className={styles.currencyCountry}>{selectedCountry}</span>
                    </div>
                    <div className={styles.balanceAmount}>
                    <p className={styles.balanceAmount}>
                        {currencySymbols[selectedCurrency?.value || ''] || ''} {(balances[selectedCurrency?.value || ''] !== undefined ? balances[selectedCurrency?.value || ''].toFixed(2) : '0.00')}
                    </p>
                    </div>
                </div>
            </div>
            <button className={styles.setLimitButton} onClick={handleSetLimitClick}>SET LIMIT</button>
            <div className={styles.searchContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search currency..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                />
            </div>
            <label className={styles.label}>Choose Currency:</label>
            <Select
                options={currencyOptions}
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                styles={customSelectStyles}
            />
            <div className={styles.buttonContainer}>
                <button className={styles.topUpButton} onClick={handleTopUpClick}>TOP UP</button>
                <button className={styles.withdrawButton} onClick={handleWithdrawClick}>WITHDRAW</button>
            </div>
        </div>
    );
}

export default MyWallet;
