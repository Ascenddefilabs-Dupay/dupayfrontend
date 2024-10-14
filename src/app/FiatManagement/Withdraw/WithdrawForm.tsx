


'use client';
import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styles from './index.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { json } from 'node:stream/consumers';
import { FaArrowLeft ,FaAngleDown} from "react-icons/fa";

const WithdrawForm: NextPage = () => {
  const [amount, setAmount] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [walletAmount, setWalletAmount] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [bankNames, setBankNames] = useState<string[]>([]);  // State for bank names
  const [selectedBank, setSelectedBank] = useState<string>('');
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);
  const [flagIconUrl, setFlagIconUrl] = useState<string | null>(null);
  const [walletId, setWalletID] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);

  const cloudinaryBaseUrl = "https://res.cloudinary.com/dgfv6j82t/";
  // const currency = 'INR';
  // const walletId = 'Wa0000000006';
  // const userID = 'DupC0014';


  useEffect(() => {
    if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
        const sessionCurrency = window.localStorage.getItem('SelectedCurrency');
        if (sessionCurrency) {
          setCurrency(sessionCurrency)
          console.log(sessionCurrency);
        }

        if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserID(storedUserId);
            const storewalletId = sessionData.fiat_wallet_id;
            setWalletID(storewalletId);

            console.log(storedUserId);
            console.log(storewalletId);
            
        } else {
            // router.push('/Userauthentication/SignIn'); 
        }
    }
}, [router]);



  useEffect(() => {
    const fetchWalletAmount = async () => {
      try {
        const response = await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_withdraw/get-wallet-amount/', {
          wallet_id: walletId,
          currency: currency,
        });
        const { amount, error } = response.data;

        if (error) {
          setAlertMessage(error);
          // router.push('/Userauthorization/Dashboard/Home');
        } else {
          setWalletAmount(amount);
          setAlertMessage('');
        }
      } catch (error) {
        const axiosError = error as { response?: { data: { error: string } } };
        console.error("Error fetching wallet amount:", axiosError);
        // setAlertMessage(axiosError.response ? axiosError.response.data.error : "An error occurred while fetching wallet data.");
        // router.push('/Userauthorization/Dashboard/Home');
      }
    };

    const fetchBankNames = async () => {
      try {
        const response = await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_withdraw/get-bank-names/', {
          user_id: userID,
        });
        setBankNames(response.data.bank_names);
      } catch (error) {
        console.error("Error fetching bank names:", error);
        setAlertMessage('Failed to load bank names.');
      }
    };

    const fetchCurrencyIcon = async () => {
      try {
        const response = await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_withdraw/get-currency-icon/', {
          currency: currency,
        });
  
        if (response.data && response.data.icon_url) {
          const fullIconUrl = cloudinaryBaseUrl + response.data.icon_url; // Combine base URL with the relative path
          console.log("Fetched full icon URL:", fullIconUrl);
          setFlagIconUrl(fullIconUrl);
        } else {
          console.error("Icon URL not found in response:", response.data);
          setAlertMessage('Currency icon not found.');
        }
      } catch (error) {
        console.error("Error fetching currency icon:", error);
        // setAlertMessage('Failed to load currency icon.');
      }
    };
  
    
    fetchCurrencyIcon();
    fetchWalletAmount();
    fetchBankNames();  // Fetch bank names on load
  }, [walletId, currency ,userID]);

  console.log(currency);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isNumber = /^\d*\.?\d*$/.test(value);
    setAmount(value);
    setIsValid(isNumber);
  };

  const handleWithdraw = async () => {
    if (!isValid || amount === '') {
      setAlertMessage('Please enter a valid amount.');
      return;
    }

    if (selectedBank === '') {
      setAlertMessage('Please select a bank.');
      return;
    }

    const enteredAmount = parseFloat(amount);
    if (enteredAmount > (walletAmount ?? 0)) {
      setAlertMessage(`You cannot withdraw more than ${walletAmount} ${currency}.`);
      return;
    }

    const remainingAmount = (walletAmount ?? 0) - enteredAmount;

    try {
      const response = await axios.post('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiat_withdraw/update-wallet-amount/', {
        wallet_id: walletId,
        currency: currency,
        new_amount: enteredAmount,
      });
    
      if (response.data.message) {
        setWalletAmount(remainingAmount);
        setAlertMessage(`Withdrawal successful! Remaining balance: ${remainingAmount} ${currency}.`);
      } else {
        setAlertMessage(response.data.error);
      }
    } catch (error) {
      const axiosError = error as { response?: { data: { error: string } } };
      console.error("Error updating wallet amount:", axiosError);
      setAlertMessage('An error occurred while processing the withdrawal.');
    }
  };

  const handleBackClick = () => {
    router.push('/Userauthorization/Dashboard/Home');
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedBank(selectedValue)

    if (selectedValue === '+') {
      router.push('/FiatManagement/AddBanks'); // Redirect if the user selects '+'
    }
  };

  return (
    <div className={styles.fiatHomeFull}>
      <div className={styles.frameParent}>
      

        <div className={styles.howMuchUsd}>How much {currency} you want to withdraw?</div>

        <div className={styles.inputContainer}>
          <div className={`${styles.textFieldWrapper} ${!isValid ? styles.errorBorder : ''}`}>
            <div className={styles.inputWrapper}>
              <label
                htmlFor="amount"
                className={`${styles.label21} ${amount ? styles.labelActive : ''}`}
              >
                Enter amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={handleChange}
                className={styles.inputMobile}
                required
              />
            </div>
          </div>
          {!isValid && <div className={styles.errorText}>Please enter a valid number</div>}
        </div>
        <div className={styles.dropdownContainer}>
  <label htmlFor="bank" className={styles.dropdownLabel}>
    Choose bank account:
  </label>

          <div className={styles.selectWrapper}>
            <select
              id="bank"
              className={styles.dropdown}
              onChange={handleBankChange} // Handle bank selection change
            >
              <option value="">Select Bank</option>
              {bankNames.map((bank, index) => (
                <option key={index} value={bank}>
                  {bank}
                </option>
              ))}
              <option value="+">+ Add New Bank</option>
            </select>
            <FaAngleDown className={styles.dropdownIcon} /> {/* Add icon here */}
          </div>
        </div>
        <div className={styles.svgContainer}>
        <svg width="200" height="220" viewBox="0 0 204 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M155.2 126.059C155.612 147.056 160.789 163.422 165.605 173.448C168.138 178.722 174.292 180.855 179.599 178.392C202.392 167.814 216.607 145.741 222.941 128.901C225.604 121.819 220.569 114.751 213.057 113.846C193.797 111.525 179.192 112.085 167.693 112.904C160.705 113.403 155.063 119.055 155.2 126.059Z" fill="url(#paint0_linear_2006_7547)"/>
          <path d="M269.704 7.67764C205.104 10.1973 154.766 64.8036 157.296 129.666C159.826 194.529 214.264 245.049 278.864 242.529C343.465 240.01 393.802 185.403 391.272 120.54C388.742 55.6777 334.305 5.15799 269.704 7.67764Z" stroke="url(#paint1_linear_2006_7547)" stroke-width="6"/>
          <circle cx="179.717" cy="179.717" r="176.717" transform="matrix(-0.0389741 -0.99924 -0.99924 0.0389741 373.168 461.044)" stroke="url(#paint2_linear_2006_7547)" stroke-width="6"/>
          <circle cx="85" cy="85" r="82" transform="matrix(1 0 0 -1 59 188.831)" stroke="url(#paint3_linear_2006_7547)" stroke-width="6"/>
          <defs>
          <linearGradient id="paint0_linear_2006_7547" x1="155.001" y1="169.053" x2="155.001" y2="130.553" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF89C2"/>
          <stop offset="0.5" stop-color="#F65BA4"/>
          <stop offset="1" stop-color="#BD46F4"/>
          </linearGradient>
          <linearGradient id="paint1_linear_2006_7547" x1="355.401" y1="74.8776" x2="149.438" y2="155.856" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E34D67"/>
          <stop offset="0.5" stop-color="#FF67E0"/>
          <stop offset="1" stop-color="#7746F4"/>
          </linearGradient>
          <linearGradient id="paint2_linear_2006_7547" x1="249.844" y1="55.4737" x2="140.44" y2="367.975" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E34D67"/>
          <stop offset="0.5" stop-color="#FF67E0"/>
          <stop offset="1" stop-color="#7746F4"/>
          </linearGradient>
          <linearGradient id="paint3_linear_2006_7547" x1="118.168" y1="26.2372" x2="66.4236" y2="174.04" gradientUnits="userSpaceOnUse">
          <stop stop-color="#E34D67"/>
          <stop offset="0.5" stop-color="#FF67E0"/>
          <stop offset="1" stop-color="#7746F4"/>
          </linearGradient>
          </defs>
          </svg>
        </div>
        
        <div className={styles.btnbtn} onClick={handleWithdraw}>
          <div className={styles.text}>Withdraw</div>
          
        </div>
      </div>
      
      

      {alertMessage && (
        <div className={styles.customAlert}>
          <p>{alertMessage}</p>
          <button onClick={() => setAlertMessage('')} className={styles.closeButton}>OK</button>
        </div>
      )}

      <div className={styles.iconflagusParent}>
        {flagIconUrl && (
          <img className={styles.flagicon} alt="" src={flagIconUrl} />
        )}
        <div className={styles.content1}>
          <div className={styles.listmbListItemBasic}>
            <div className={styles.listmbListItemitemLeft}>
              <div className={styles.title}>Total {currency}</div>
            </div>
            <div className={styles.listmbListItemitemRight}>
              <div className={styles.title1}>
                {walletAmount !== null ? `${walletAmount} ${currency}` : `0 ${currency}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navbarnavBar}>
        <div className={styles.navbaritemleftBtn} onClick={handleBackClick} style={{ cursor: 'pointer' }}>
          <div className={styles.iconiconWrapper}>
            <img
              className={styles.iconarrowLeftBack}
              alt="Back"
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067208/1826c340-1853-453d-9ad0-6cafb099b947.png"
            />
          </div>
          
        </div>
        <div className="purpleDesign"></div>  
        <div className={styles.hereIsTitle}>Withdraw Fiat {currency}</div>
      </div>
    </div>
  );
};

export default WithdrawForm;
