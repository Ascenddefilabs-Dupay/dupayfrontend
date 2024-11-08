"use client";
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import styles from './Home.module.css';
import { styled } from '@mui/material/styles';
import { redirect } from 'next/navigation';
import { FaUserCircle } from "react-icons/fa";
import Select from 'react-select';
import React from 'react';
import LottieAnimation from '../../../assets/animation'
import LottieAnimationLoading from '../../../assets/LoadingAnimation';
import { IoMdRefresh } from "react-icons/io";
import { Refresh } from '@mui/icons-material';
import { fontSize } from '@mui/system';
import { Navigate } from 'react-router-dom';
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
const UserAuthorization = process.env.NEXT_PUBLIC_UserAuthorization

const FiatManagement = process.env.NEXT_PUBLIC_FiatManagement
interface FiatWallet {
balance: string; 
currency_type: string;
wallet_id: string;
}

interface FiatWalletData{
  fiat_wallet_id: string;
}
// interface AdminCMSData {
//   account_type: string;
  
// }
interface Wallet {
  wallet_id: string;
  sui_address: string;
  balance: string;
  user_id: string;
}

const currencySymbols: { [key: string]: string } = {
  'INR': '₹',
  'USD': '$',
  'EURO': '€',
  'GBP': '£',
  'AUS': 'A$',
  'JPY': '¥',
  'AED': 'AED',
};

const BiCopy = dynamic(() => import('react-icons/bi').then((mod) => mod.BiCopy));
const BsBank2 = dynamic(() => import('react-icons/bs').then((mod) => mod.BsBank2));
const PiHandWithdraw = dynamic(() => import('react-icons/pi').then((mod) => mod.PiHandWithdraw));
const BiTransfer = dynamic(() => import('react-icons/bi').then((mod) => mod.BiTransfer));
const LuPlusCircle = dynamic(() => import('react-icons/lu').then((mod) => mod.LuPlusCircle));
const AssessmentIcon = dynamic(() =>
  import('@mui/icons-material/Assessment').then((mod) => mod.default)
);

interface UserProfileData {
  user_id: string;
  user_profile_photo?: string | { data: number[] };
}
interface ErrorState {
  accountType?: string;
  walletName?: string;
  email?: string;
  securityPin?: string;
}
interface AccountTypeOption {
  value: string;
  label: string;
}
type ValidNetworkName = "testnet" | "devnet" | "localnet";
const NETWORK: ValidNetworkName = "testnet";

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});


const Home = () => {
  const [activeTab, setActiveTab] = useState('Crypto');
  // const [activeTab, setActiveTab] = useState('fiat'); // Default active tab to 'fiat'
  const [activeAction, setActiveAction] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fiatDropdownVisible, setFiatDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [fiatWalletId, setFiatWalletId] = useState(''); // New state for fiat_wallet_id
  const [fiatWalletBalance, setFiatWalletBalance] = useState(''); // New state for fiat_wallet_balance
  const [fetchedUserId, setFetchedUserId] = useState(''); // Added state for fetchedUserId
  // const userId = 'DupC0005';
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fiatDropdownRef = useRef<HTMLDivElement | null>(null);
  const [userFirstName, setUserFirstName] = useState(''); // For storing user first name
  const [isDupayOpen, setIsDupayOpen] = useState(false);


  const [isFiatTabSelected, setIsFiatTabSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });
  const [userId, setUserId] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [storedCurrency, setCurrency] = useState<string | null>(null);
  const [addNewFiatWallet, setAddNewFiatWallet] = useState(false);
  const [addNewFiatWalletPage, setAddNewFiatWalletPage] = useState(false);
  const [walletData, setWalletData] = useState<FiatWallet[]>([]);
  const [currencyIcons, setCurrencyIcons] = useState<{ currency_type: string; icon: string }[]>([]);
  const [fiatwalletData, setFiatWalletData] = useState<string>("");
  const [fiatwalletMobileNumer, setFiatWalletMobileNumber] = useState<string>("");
  // const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeOption | null>(null);
  // const [adminCMSData, setAdminCMSData] = useState<AdminCMSData[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [walletName, setWalletName] = useState("");
  const [email, setEmail] = useState("");
  const [securityPin, setSecurityPin] = useState("");
  const [error, setError] = useState<ErrorState>({});
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [balance, setBalance] = useState<string | null>(null); // Allow string or null
  const [suiAddress, setSuiAddress] = useState<string | null>(null); // Allow string or null
  const [navigateToSuccess, setNavigateToSuccess] = useState(false);

  
  useEffect(() => {
    setLoading(false)
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId = sessionData.user_id;
        setUserId( storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
        if (sessionData.user_email) {
          setEmail(sessionData.user_email); // Pre-fill email from localStorage
        }
      } else {
        // redirect('http://localhost:3000/Userauthentication/SignIn');
      }
    }
  }, []);

  useEffect(() => {
    if(typeof window !== 'undefined'){
      const sessionStorageDataString = window.localStorage.getItem('session_data');
      if(sessionStorageDataString){
        const wallet_id = JSON.parse(sessionStorageDataString);
        setFiatWalletData(wallet_id.fiat_wallet_id);
        if(count!==1){
          wallet_data();
        }
      }
    }
  })

  useEffect(() => {
    if(typeof window !== 'undefined'){
      const sessionStorageDataString = window.localStorage.getItem('user_details');
      if(sessionStorageDataString){
        const mobileNumber = JSON.parse(sessionStorageDataString);
        setFiatWalletMobileNumber(mobileNumber.mobileNumber);
        if(count!==1){
          wallet_data();
        }
      }
    }
  })

   useEffect(() => {
    const savedTab = localStorage.getItem('activeTab') || 'Crypto';
    const savedCryptoDropdownState = localStorage.getItem('cryptoDropdownOpen') === 'true';
    // const savedFiatDropdownState = localStorage.getItem('fiatDropdownOpen') === 'true';
    if (fiatwalletData) {
      setAddNewFiatWallet(true);
    }else{
      setAddNewFiatWallet(false);
        setFiatDropdownVisible(true);
    }

    setActiveTab(savedTab);
    setDropdownVisible(savedCryptoDropdownState); // Restore Crypto dropdown state

    if (savedTab === 'Fiat') {
      setDropdownVisible(false); // Hide Crypto dropdown if Fiat is active
      setIsFiatTabSelected(true);
    } else if (savedTab === 'Crypto') {
      setDropdownVisible(savedCryptoDropdownState); // Show Crypto dropdown if active
      setFiatDropdownVisible(false); // Hide Fiat dropdown if Crypto is active
    } else {
      setDropdownVisible(false);
      setFiatDropdownVisible(false);
    }
  }, []);
  
  // useEffect(() => {
  //   axios
  //     .get<AdminCMSData[]>('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/account-types/')
  //     .then((response) => {
  //       setAdminCMSData(response.data);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching account types:', error);
  //       setLoading(false);
  //     });
  // }, []);
  // const accountTypeOptions: AccountTypeOption[] = adminCMSData
  //   .filter((data) => data.account_type !== null)
  //   .map((data) => ({
  //     value: data.account_type,
  //     label: data.account_type,
  //   }));

    const validateFields = (): boolean => {
      const newError: ErrorState = {};
      // if (!selectedAccountType) newError.accountType = "Account type is required.";

      if (!walletName) newError.walletName = "Wallet name is required.";
      if (!email) newError.email = "Email is required.";
      if (!securityPin || securityPin.length !== 4) {
        newError.securityPin = "Security PIN must be a 4-digit number.";
      }
      setError(newError);
      setAlertMessage(Object.keys(newError).length > 0 ? "Please correct the errors before submitting." : "");
      return Object.keys(newError).length === 0;
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      if (!validateFields()) return;
  
      const payload = {
        // fiat_wallet_id: "generated_id_here",
        // fiat_wallet_type: selectedAccountType?.value,
        // fiat_wallet_address: "",
        fiat_wallet_balance: 0,
        fiat_wallet_created_time: new Date().toISOString(),
        fiat_wallet_updated_time: new Date().toISOString(),
        fiat_wallet_phone_number: fiatwalletMobileNumer,
        fiat_wallet_email: email,
        // qr_code: "",
        user_id: userId,
      };
  
      try {
        const response = await axios.post(`${FiatManagement}/fiatmanagementapi/fiat_wallets/`, payload);
       
        setAlertMessage("Wallet created successfully!");
        resetForm();
        setAddNewFiatWalletPage(false);
        setAddNewFiatWallet(false);
        router.push(`/Userauthorization/Dashboard/SuccessPage?fiat_wallet_address=${response.data.fiat_wallet_address}`);
 
        resetForm();
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            sessionData.fiat_wallet_id = response.data.fiat_wallet_id;
            window.localStorage.setItem('session_data', JSON.stringify(sessionData));
          }
        }
      } catch (error) {
        console.error("Error creating wallet:", error);
        setAlertMessage("Error creating wallet. Please try again.");
      }
    };
  
    const resetForm = () => {
      // setSelectedAccountType(null);
      setWalletName("");
      setEmail("");
      setSecurityPin("");
      setError({});
      setAlertMessage("");
    };

    const handleDupayClick = () => {
      setIsDupayOpen(true); // Open the blur screen with buttons
      };
    
      const handleClose = () => {
      setIsDupayOpen(false); // Close the blur screen
      };

  const handleTabClick = async (tab: string) => {
    if (tab === 'Fiat') {
      setIsFiatTabSelected(true);
      setActiveTab(tab);
      // localStorage.setItem('activeTab', 'Fiat');

      if (!fiatwalletData) {
        setAddNewFiatWallet(true);
        setFiatDropdownVisible(false);
      } else {
        setAddNewFiatWallet(false);
        setFiatDropdownVisible(true);
        setAddNewFiatWalletPage(false);
        // localStorage.setItem('fiatDropdownOpen', 'true');
      }
    } else {
      setIsFiatTabSelected(false);
      setActiveTab(tab);
      // localStorage.setItem('activeTab', tab);

      if (tab === 'Crypto') {
        setAddNewFiatWallet(false);
        setFiatDropdownVisible(false);
        setDropdownVisible(true);
        setAddNewFiatWalletPage(false);
        // localStorage.setItem('fiatDropdownOpen', 'false'); // Close Fiat dropdown
        // localStorage.setItem('cryptoDropdownOpen', 'true'); // Open Crypto dropdown
      } else {
        setFiatDropdownVisible(false);
        setAddNewFiatWalletPage(false);
        setDropdownVisible(false);
        setAddNewFiatWallet(false);
        // localStorage.setItem('fiatDropdownOpen', 'false'); // Close Fiat dropdown
        // localStorage.setItem('cryptoDropdownOpen', 'false'); // Close Crypto dropdown
      }
    }
  };
  
  if (navigateToSuccess) {
    return <Navigate to="/success" />; // Use Navigate for redirection
  }
  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
      if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target as Node)) {
        if (!fiatDropdownRef.current.contains(event.target as Node)) {
          setFiatDropdownVisible(false);
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownVisible, fiatDropdownVisible]);
  


  useEffect(() => {
    fetchUserProfile();
    if (userId) {
      fetchFiatWalletId();
    }
  }, [userId]); 

      const fetchFiatWalletId = async () => {
        try {
          // const response = await axios.get(`${UserAuthorization}/userauthorizationapi/fiat_wallets_fetch/${userId}/`);
          const response = await axios.get(`${FiatManagement}/userauthorizationapi/fiat_wallets_fetch/${userId}/`);

          console.log('Fetched Fiat Wallet ID:', response.data); // Debugging
          const { fiat_wallet_id, fiat_wallet_balance, user } = response.data;
          setFiatWalletId(fiat_wallet_id);
          setFiatWalletBalance(fiat_wallet_balance);
          setFetchedUserId(user);
          console.log('Fetched User ID:', user);

       // Compare manually set user ID with fetched user ID
      if (userId !== user) {
        await Swal.fire({
          title: 'User ID Mismatch',
          text: 'The User ID does not match. Please check your credentials.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error fetching fiat wallet ID:', error);
    }
  };

  useEffect(() => {
    if (!userId) {
        console.log('User ID is null or undefined.');
        return; // Early return if userId is not available
    }
  
    // Fetch the data from the backend
    // axios.get<Wallet[]>(`http://127.0.0.1:8000/userauthorizationapi/fetch-crypto-wallet/${userId}/`)
    axios.get<Wallet[]>(`${UserAuthorization}/userauthorizationapi/fetch-crypto-wallet/${userId}/`)
        .then(async response => {
            console.log('Response Data:', response.data); // Log the response data
  
            // Check if the response contains data
            if (response.data.length > 0) {
                // Find the wallet that matches the userId
                const userWallet = response.data.find((wallet: Wallet) => wallet.user_id === userId.trim());
                
                // If a matching wallet is found, set the balance and address
                if (userWallet) {
                    // setBalance(userWallet.balance); // Set the balance
                    setSuiAddress(userWallet.sui_address); // Set the SUI address
                    try {
                      // Fetch real-time SUI balance from Sui blockchain
                      const suiBalance = await suiClient.getBalance({
                          owner: userWallet.sui_address,
                          coinType: "0x2::sui::SUI"
                      });

                      // Update balance in state after converting to display format
                      setBalance((+suiBalance.totalBalance / 1_000_000_000).toString()); 
                      console.log('Fetched Balance:', (+suiBalance.totalBalance / 1_000_000_000).toString());
                  } catch (error) {
                      console.error('Error fetching real-time SUI balance:', error);
                      setBalance(null); // Handle error by setting balance to null
                  }
  
                    // Print balance and suiAddress to the console
                    console.log('Balance:', userWallet.balance);
                    console.log('SUI Address:', userWallet.sui_address);
                } else {
                    // Handle case where no wallet matches the user ID
                    console.log('No wallet found for the user ID.');
                    setBalance(null);
                    setSuiAddress(null);
                }
            } else {
                // Handle case where no records are found
                setBalance(null);
                setSuiAddress(null);
                console.log('No records found for the user ID.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Optionally handle errors
        });
  }, [userId]); // Add userId to dependency array
  

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${UserAuthorization}/userauthorizationapi/profile/${userId}/`);
      // const response = await axios.get(`http://127.0.0.1:8000/userauthorizationapi/profile/${userId}/`);

      if (response.data.user_first_name) {
        const userFirstName = response.data.user_first_name;
        console.log('User First Name:', userFirstName);
        setUserFirstName(userFirstName);  // Set state or handle it as needed
      }

      if (response.data.user_profile_photo) {
        const baseURL = '/profile_photos';
        let imageUrl = '';
        if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
          imageUrl = response.data.user_profile_photo;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
          imageUrl = `${baseURL}${response.data.user_profile_photo}`;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
          const byteArray = new Uint8Array(response.data.user_profile_photo.data);
          const base64String = btoa(
            byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageUrl = `data:image/jpeg;base64,${base64String}`;
        }

        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };


 const toggleDropdown = (tab: string) => {
  if (tab === 'Crypto') {
    const newState = !dropdownVisible;
    setDropdownVisible(newState);
    localStorage.setItem('cryptoDropdownOpen', newState.toString()); // Save state
  } else if (tab === 'Fiat') {
    const newState = !fiatDropdownVisible;
    setFiatDropdownVisible(newState);
    localStorage.setItem('fiatDropdownOpen', newState.toString()); // Save state
  }
};

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
      if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target as Node)) {
        setFiatDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownVisible, fiatDropdownVisible]);

  const handleAddCryptoClick = () => {
    router.push('/Userauthorization/Dashboard/addcrypto_btn'); // Ensure the correct path here
  };
  const handleNavigation = (route: string) => {
    router.push(route); 
    setLoading(true); 
  };


  const ProfileImage = styled('img')({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '5px',
    border: '2px solid white',
  });

  const handleButtonClickblur = (currency: string) => {
    setCurrency(currency);
    console.log("Currency clicked:", currency);
    setIsBlurred(true);
    localStorage.setItem('SelectedCurrency', `${currency}`);
    console.log("SelectedCurrency:", currency);
    
  };

  const closeModal = () => {
    setIsBlurred(false);
  };

  const handleAddFiatWallet = () => {
    setAddNewFiatWalletPage(true);
  };

  const handleSubbmit = () => {
    setFiatDropdownVisible(true);
  };

  const handleAddBack = () => {
    router.push('/FiatManagement/AddBanks');
    setLoading(true);
  };
  const handleSwap = () => {

    router.push(`/FiatManagement/FiatSwap?currency=${storedCurrency}&wallet_id=${fiatwalletData}`);
   
    setLoading(true);
  };
  const handleWithDraw = () => {
    router.push('/FiatManagement/Withdraw');

    setLoading(true);
  };
  const handleTransfor = () => {
    router.push('/TransactionType/AllTransactions');
    setLoading(true);
  };
  const handleTopUp = () => {
    router.push('/FiatManagement/Topup');
    setLoading(true);
  };

const wallet_data = () => {
    axios
    // .get<{ fiat_wallets: FiatWallet[] }>(`http://127.0.0.1:8000/Fiat_Currency/fiat_wallet/${fiatwalletData}/`)
    .get<{ fiat_wallets: FiatWallet[] }>(`${FiatManagement}/Fiat_Currency/fiat_wallet/${fiatwalletData}/`)
      .then((response) => {
        const wallets = response.data.fiat_wallets;
        setWalletData(wallets);
        const currencies = wallets.map((wallet) => wallet.currency_type); // Modify to match the exact key
        setCurrencyList(currencies); 
        setCount(count+1);
      })
      .catch((err) => {  
        setLoading(false); 
      });
  };

  useEffect(() => {
    if (currencyList.length > 0) {
      const fetchIcons = async () => {
        try {
          const requests = currencyList.map((currency_type) =>
            axios.get<{ currency_icons: { currency_type: string; icon: string }[] }>(
              `${FiatManagement}/Fiat_Currency/icon/${currency_type}/`
              // `http://127.0.0.1:8000/Fiat_Currency/icon/${currency_type}/`
            )
          );

          const responses = await Promise.all(requests);
          const allIcons = responses.flatMap(response => response.data.currency_icons);
          setCurrencyIcons(allIcons);
        } catch (error) {
          console.error('Error fetching currency icons:', error);
        }
      };

      fetchIcons();
    }
  }, [currencyList]);


  // Function to copy address and display a toast notification
  const [showCopied, setShowCopied] = useState(false);

  const CopySuiAddressinClipboard = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation(); // Prevents handleDupayClick from triggering

    if (suiAddress) {
      navigator.clipboard.writeText(suiAddress)
        .then(() => {
          setShowCopied(true);
          setTimeout(() => {
            setShowCopied(false);
          }, 2000); // Show the copied message for 2 seconds
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          // Handle error if needed
        });
    }
  };


const [greeting, setGreeting] = useState('');

useEffect(() => {
  const updateGreeting = () => {
    const hours = new Date().getHours();
    let greetingText;

    if (hours >= 5 && hours < 12) {
      greetingText = 'Good morning ';
    } else if (hours >= 12 && hours < 17) {
      greetingText = 'Good afternoon ';
    } else if (hours >= 17 && hours < 21) {
      greetingText = 'Good evening ';
    } else {
      greetingText = 'Good night ';
    }

    setGreeting(greetingText);
  };

  // Update greeting initially
  updateGreeting();
  
  // Set an interval to update the greeting every minute
  const intervalId = setInterval(updateGreeting, 60000);

  // Cleanup interval on component unmount
  return () => clearInterval(intervalId);
}, []);

const [isLoading, setIsLoading] = useState(false);

const handleRefresh = () => {
  setIsLoading(true); // Trigger the flash animation
  setTimeout(() => {
    // After the animation completes, reset loading state
    setIsLoading(false);
  }, 1000); // Match the duration of the animation
};


  return (
    // <div className={styles.container}>
    <div className={`${styles.container} ${isBlurred ? styles.blur : ''}`}>
       {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black', margin: '0 auto'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading  />
      </div>
      ) : (
        <>
<img className={styles.back_img} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074021/Frame_mp4g4t.png" />

      <div className={styles.header}>
        <div className={styles.leftSection} >
          <div className={styles.walletAddress} >
            <div className={styles.chatBubbleParent}>
        				<img className={styles.chatBubbleIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074910/messagelogo_geocnl.png" />
                <button onClick={() => handleNavigation('/Notificationservice/Notifications')}
                >
                <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075270/Notificationlogo_aglon1.png" />
                </button>
      			</div>
             <div className={styles.goodMorningAnuroopContainer}>
              <span>{greeting}</span>
              {/* <b>{userFirstName || 'User'}</b> */}
            </div>
          </div>
        </div>
        <div className={styles.rightSection}>    </div>
      </div>
              
                  <div className={styles.tabs}>
                    {['Crypto', 'Fiat', 'NFTs'].map((tab) => (
                      <button
                        key={tab}
                        className={activeTab === tab ? styles.activeTab : styles.tab}
                        onClick={() => handleTabClick(tab)}
                      >
                        {/* Dropdown button only for Crypto and Fiat */}
                        {tab === 'Crypto' && (
                          <div
                            onClick={() => toggleDropdown('Crypto')}
                            style={{ position: 'absolute', opacity: 0 }} // Hide the text but don't affect layout
                          >
                            {dropdownVisible ? 'Hide' : 'Show'}
                          </div>
                        )}
                        {tab === 'Fiat' && (
                          <div
                            onClick={() => toggleDropdown('Fiat')}
                            style={{ position: 'absolute', opacity: 0 }} // Hide the text but don't affect layout
                          >
                            {fiatDropdownVisible ? 'Hide' : 'Show'}
                          </div>
                        )}
                        {tab}
                      </button>
                    ))}
                  </div>


      <div className={styles.content}>
      {/* {activeTab === 'Crypto' && (
          <div className={styles.cryptoContent} >
              <div className={styles.yourCryptoWallets4Parent}>
                <div className={styles.yourCryptoWallets}>Your Wallets (1) </div>
              </div>
              <button className={styles.addNew1} onClick={handleRefresh}><IoMdRefresh /></button>
            <div className={styles.frameParent} onClick={handleDupayClick}>
                <div className={styles.frameGroup}>
                </div>
                <div className={styles.frameContainer}>
                  <div className={styles.int000Wrapper}>
                  <div className={styles.int000}>
                      {balance !== null 
                          ? (balance.toString().split('.').length > 1 
                              ? `${balance.toString().split('.')[0]}.${balance.toString().split('.')[1].slice(-4)}` 
                              : balance) 
                          : '0.00'}
                  </div>

                  </div>
                <div className={styles.ethParent}>
                  <div className={styles.eth}>Sui</div>
                  <img className={styles.ethIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727269628/Sui_logo_growhu.png" />
                </div>
            </div>
                <div className={styles.frameDiv}>
                    <div className={styles.int000Parent}>
                    <div className={styles.int0001}>
                        {suiAddress !== null ? 
                            `${suiAddress.slice(0, 6)}...${suiAddress.slice(-5)}` : 
                            'Address not found'}
                      
                    </div>
                    <b className={styles.int0002} onClick={CopySuiAddressinClipboard}>
                    <BiCopy />
                    </b>
                </div>
                <div className={styles.ethereumWrapper}>
                  <div className={styles.eth}>Ethereum</div>
                </div>
                </div>
              </div>
          </div>
        )} */}

{activeTab === 'Crypto' && (
      <div className={styles.cryptoContent}>
        
        <div className={styles.yourCryptoWallets4Parent}>
          <div className={styles.yourCryptoWallets}>Your Wallets (1)</div>
        </div>
        <button className={styles.addNew1} onClick={handleRefresh}>
          <IoMdRefresh />
        </button>
        <div className={styles.frameParent} onClick={handleDupayClick}>
          <div className={styles.frameGroup}></div>
          <div className={styles.frameContainer}>
          <div className={`${styles.int000Wrapper} ${isLoading ? styles.flash : ''}`}>
          <div className={styles.int000}>
                {balance !== null 
                    ? (balance.toString().split('.').length > 1 
                        ? `${balance.toString().split('.')[0]}.${balance.toString().split('.')[1].slice(0, 4)}` 
                        : balance) 
                    : 'Loading..'}
              </div>
            </div>
            <div className={`${styles.ethParent} ${isLoading ? styles.flash : ''}`}>
            <div className={styles.eth}>Sui</div>
              <img className={styles.ethIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727269628/Sui_logo_growhu.png" />
            </div>
          </div>
          <div className={`${styles.frameDiv} ${isLoading ? styles.flash : ''}`}>
          <div className={styles.int000Parent}>
              <div className={styles.int0001}>
                {suiAddress !== null ? 
                    `${suiAddress.slice(0, 6)}...${suiAddress.slice(-5)}` : 
                    'Address not found'}
              </div>
              <button className={styles.int0002} onClick={(event) => CopySuiAddressinClipboard(event)}>
        <BiCopy />
      </button>

      {showCopied && (
        <div className={styles.copiedMessage}>
          Address copied!
        </div>
      )}
            </div>
            {/* <div className={styles.ethereumWrapper}>
              <div className={styles.eth}>Ethereum</div>
            </div> */}
          </div>
        </div>
      </div>
    )}

        {addNewFiatWallet && (
              <div>
                <div className={styles.newwalleticon}><svg width="132" height="111" viewBox="0 0 132 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M83 21C83 29.8366 75.8366 37 67 37C58.1634 37 51 29.8366 51 21C51 12.1634 58.1634 5 67 5C75.8366 5 83 12.1634 83 21ZM87.7873 23.9999C86.3317 34.1769 77.5794 42 67 42C55.402 42 46 32.598 46 21C46 9.40202 55.402 0 67 0C77.9234 0 86.8988 8.34011 87.906 18.9999H95.5002V9.41416C95.5002 6.29596 99.2702 4.73442 101.475 6.93929L130.061 35.5251C131.428 36.8919 131.428 39.108 130.061 40.4748L101.311 69.2245C100.226 70.3097 98.7647 70.432 97.6591 70.0648C96.5718 69.7037 95.5489 68.7905 95.224 67.4308C94.7411 65.4102 93.6693 63.0385 91.7695 61.1997C89.924 59.4135 87.1698 57.9999 83.0002 57.9999H68.9998V58.0001H48.9998C43.5597 58.0001 39.5507 56.1007 36.7532 53.3931C34.7248 51.4298 33.403 49.1123 32.5906 46.9448L6.53538 73.0001L31.4998 97.9645V90.5001C31.4998 88.5671 33.0669 87.0001 34.9998 87.0001H46.2127C47.6683 76.8232 56.4206 69 67 69C78.598 69 88 78.402 88 90C88 101.598 78.598 111 67 111C56.0766 111 47.1012 102.66 46.094 92.0001H36.4998V101.586C36.4998 104.704 32.7298 106.266 30.525 104.061L1.93919 75.4749C0.57235 74.1081 0.572357 71.892 1.93919 70.5252L30.6889 41.7755C31.7741 40.6903 33.2353 40.568 34.3409 40.9352C35.4282 41.2963 36.4511 42.2095 36.776 43.5692C37.2589 45.5898 38.3307 47.9615 40.2305 49.8003C42.076 51.5865 44.8302 53.0001 48.9998 53.0001H63.0002V52.9999H83.0002C88.4403 52.9999 92.4493 54.8993 95.2468 57.6069C97.2752 59.5702 98.597 61.8877 99.4094 64.0552L125.465 37.9999L100.5 13.0355V20.4999C100.5 22.4329 98.9332 23.9999 97.0002 23.9999H87.7873ZM67 106C75.8366 106 83 98.8366 83 90C83 81.1634 75.8366 74 67 74C58.1634 74 51 81.1634 51 90C51 98.8366 58.1634 106 67 106ZM63.518 28.6742C64.0596 28.8722 64.6368 29.0139 65.2495 29.0994V31.7C65.2495 31.8657 65.3838 32 65.5495 32H67.9727C68.1384 32 68.2727 31.8657 68.2727 31.7V29.0924C68.9551 28.995 69.569 28.8295 70.1142 28.5959C71.0486 28.1953 71.7632 27.6294 72.2579 26.898C72.7526 26.1666 73 25.3047 73 24.3121C73 23.215 72.5877 22.2224 71.7632 21.3343C70.957 20.4288 69.8118 19.8019 68.3277 19.4536L66.0465 18.9051C65.4235 18.7658 64.9288 18.5481 64.5624 18.2521C64.2142 17.9386 64.0402 17.5294 64.0402 17.0244C64.0402 16.3975 64.2692 15.9099 64.7273 15.5616C65.1853 15.1959 65.8083 15.0131 66.5962 15.0131C67.4024 15.0131 68.062 15.2047 68.5751 15.5878C69.014 15.8898 69.3342 16.2395 69.5355 16.6366C69.6069 16.7774 69.7647 16.8598 69.9164 16.8161L72.6885 16.0171C72.8565 15.9687 72.9483 15.7871 72.8784 15.6268C72.5923 14.971 72.2023 14.4007 71.7082 13.916C71.1402 13.3414 70.4348 12.906 69.592 12.61C69.1856 12.4641 68.7458 12.3541 68.2727 12.2802V10.3C68.2727 10.1343 68.1384 10 67.9727 10H65.5495C65.3838 10 65.2495 10.1343 65.2495 10.3V12.2548C63.9598 12.4226 62.9154 12.8284 62.1163 13.472C61.0536 14.3427 60.5222 15.5529 60.5222 17.1028C60.5222 17.9212 60.6963 18.6439 61.0444 19.2708C61.3925 19.8803 61.8872 20.394 62.5285 20.8119C63.1698 21.2298 63.9119 21.552 64.7548 21.7784L67.0085 22.3008C67.7597 22.4749 68.346 22.7448 68.7674 23.1105C69.2072 23.4588 69.4271 23.8767 69.4271 24.3643C69.4271 24.9738 69.1522 25.4614 68.6025 25.8271C68.0712 26.1928 67.3749 26.3669 66.5137 26.3495C65.6892 26.3321 65.0021 26.1405 64.4524 25.7748C64.0074 25.4539 63.678 25.0842 63.4643 24.6655C63.394 24.5278 63.2393 24.4485 63.0904 24.4902L60.2789 25.2787C60.1233 25.3223 60.0289 25.4819 60.0806 25.635C60.275 26.2102 60.6329 26.7532 61.1543 27.2637C61.7773 27.8558 62.5652 28.3259 63.518 28.6742ZM60 99.309C60 99.4195 60.0895 99.509 60.2 99.509H62.8842C62.9947 99.509 63.0842 99.5986 63.0842 99.709V100.8C63.0842 100.91 63.1738 101 63.2842 101H65.1974C65.3078 101 65.3974 100.91 65.3974 100.8V99.709C65.3974 99.5986 65.4869 99.509 65.5974 99.509H66.1684L66.7395 99.5089C66.8499 99.5089 66.9395 99.5985 66.9395 99.7089V100.8C66.9395 100.91 67.029 101 67.1395 101H69.3602C69.4706 101 69.5602 100.91 69.5602 100.8V99.709C69.5602 99.5986 69.6498 99.5092 69.7603 99.5074C70.9721 99.4871 72.0342 99.2819 72.9466 98.8917C73.9089 98.4801 74.6584 97.8717 75.195 97.0665C75.7317 96.2612 76 95.286 76 94.1408C76 93.1029 75.7502 92.2171 75.2505 91.4835C74.8258 90.82 74.2352 90.2751 73.4787 89.8487C73.3438 89.7726 73.332 89.5772 73.4567 89.4854C74.0031 89.0829 74.4345 88.6216 74.7509 88.1015C75.1395 87.4752 75.3338 86.7952 75.3338 86.0616C75.3338 84.8805 75.0562 83.8964 74.5011 83.109C73.9459 82.3038 73.1687 81.7043 72.1694 81.3107C71.1701 80.917 69.8237 80.7201 69.3478 80.7201C69.2952 80.7201 69.2526 80.6775 69.2526 80.625V79.2C69.2526 79.0895 69.1631 79 69.0526 79H67.0441C66.9336 79 66.8441 79.0895 66.8441 79.2V80.5201C66.8441 80.6306 66.7546 80.7201 66.6441 80.7201L65.5974 80.7201C65.4869 80.7201 65.3974 80.6306 65.3974 80.5201V79.2C65.3974 79.0895 65.3078 79 65.1974 79L62.9939 79C62.8834 79 62.7938 79.0896 62.7938 79.2V80.5201C62.7938 80.6306 62.7043 80.7201 62.5938 80.7201H60.2C60.0895 80.7201 60 80.8097 60 80.9201V83.4458C60 83.5563 60.0895 83.6458 60.2 83.6458H61.8933C62.0037 83.6458 62.0933 83.7354 62.0933 83.8458V96.0612C62.0933 96.1717 62.0037 96.2612 61.8933 96.2612H60.2C60.0895 96.2612 60 96.3508 60 96.4612V99.309ZM66.0128 96.2612C65.9024 96.2612 65.8129 96.1717 65.8129 96.0612V91.5761C65.8129 91.4657 65.9024 91.3761 66.0128 91.3761H68.894C69.8933 91.3761 70.6797 91.5998 71.2534 92.0471C71.8271 92.4766 72.1139 93.0761 72.1139 93.8455C72.1139 94.5792 71.8548 95.1697 71.3367 95.617C70.8185 96.0465 70.1061 96.2612 69.1993 96.2612H66.0128ZM66.0128 88.3699C65.9024 88.3699 65.8129 88.2804 65.8129 88.1699V83.8458C65.8129 83.7354 65.9024 83.6458 66.0128 83.6458H68.4499C69.3751 83.6458 70.1061 83.8516 70.6427 84.2632C71.1794 84.6748 71.4477 85.2563 71.4477 86.0079C71.4477 86.7594 71.2071 87.341 70.726 87.7525C70.2449 88.1641 69.5879 88.3699 68.7552 88.3699H66.0128Z" fill="url(#paint0_linear_541_4855)" />
                  <defs>
                    <linearGradient id="paint0_linear_541_4855" x1="0.914062" y1="0" x2="133.855" y2="3.42172" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#70A2FF" />
                      <stop offset="1" stop-color="#F76E64" />
                    </linearGradient>
                  </defs>
                </svg>
                  <h3>Add Fiat to get started</h3>
                </div>
                <button className={styles.newwalletbutton} onClick={handleAddFiatWallet}>Add new Fiat wallet</button>
                <p className={styles.newwalletpara}>Requires password security each time you create a wallet.</p>
              </div>
            )}
        {activeTab === 'Fiat' && fiatDropdownVisible && (
          <div>
          <div>
                      <div className={`${styles.frameDiv} ${isLoading ? styles.flash : ''}`}>
                        <ul className={styles.list}>
                        <li className={styles.listHeader}>
                          <span className={styles.span}>
                            Your Fiat Wallets ({walletData.filter((w: { currency_type: string }) => w.currency_type !== 'Unknown').length})
                          </span>
                          <button className={styles.addNew} onClick={handleRefresh}><IoMdRefresh /></button>
                        </li>
                        {walletData.filter((w: { currency_type: string }) => w.currency_type !== 'Unknown').length === 0 ? (
                          <li className={styles.listItem}>
                            <div>
                              <label className={styles.noWallets}>You Do Not Have Wallets <a className={styles.addNewLink}>Add New</a></label>
                            </div>
                          </li>
                        ) : (
                          currencyList.map((currency, index) => {
                            const wallet = walletData.find((w: { currency_type: string }) => w.currency_type === currency);
                            const balance = wallet ? Number(wallet.balance).toFixed(2) : '0.00';
                            const currencyType = wallet ? wallet.currency_type : 'Unknown';

                            // If the currency type is unknown, skip rendering this row
                            if (currencyType === 'Unknown') {
                              return null;
                            }

                            const iconData = currencyIcons.find((icon) => icon.currency_type === currencyType);
                            const iconUrl = iconData ? `https://res.cloudinary.com/dgfv6j82t/${iconData.icon}` : 'https://res.cloudinary.com/dgfv6j82t/image/upload/v1727948965/61103_ttcaan.png';
                            // const iconUrl = iconData ? `https://res.cloudinary.com/dgfv6j82t/${iconData.icon}` : '';

                            return (
                              <li className={styles.listItem} key={index}>
                                <button className={styles.listbackground} onClick={() => handleButtonClickblur(currency)}>
                                  <img className={styles.currencyicon} src={iconUrl} alt={`${currency} icon`} />
                                  <div className={styles.currencylist}>
                                    <button className={styles.button1}><div>{currencyType}</div></button>
                                    <label className={styles.button2}>{`${currencySymbols[currency] || ''}${balance}`}</label>
                                  </div>
                                </button>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  </div>
                  {isBlurred && (
                    <div className={styles.modaloverlay}>
                      <div className={styles.modalcontent}>
                        <div className={styles.modalbuttons}>
                          <button className={styles.modalbutton} onClick={handleAddBack}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_1139_10877)" />
                            <g clip-path="url(#clip0_1139_10877)">
                              <path d="M26 25C25.1667 25 24.4583 24.7083 23.875 24.125C23.2917 23.5417 23 22.8333 23 22C23 21.1667 23.2917 20.4583 23.875 19.875C24.4583 19.2917 25.1667 19 26 19C26.8333 19 27.5417 19.2917 28.125 19.875C28.7083 20.4583 29 21.1667 29 22C29 22.8333 28.7083 23.5417 28.125 24.125C27.5417 24.7083 26.8333 25 26 25ZM19 28C18.45 28 17.9792 27.8042 17.5875 27.4125C17.1958 27.0208 17 26.55 17 26V18C17 17.45 17.1958 16.9792 17.5875 16.5875C17.9792 16.1958 18.45 16 19 16H33C33.55 16 34.0208 16.1958 34.4125 16.5875C34.8042 16.9792 35 17.45 35 18V26C35 26.55 34.8042 27.0208 34.4125 27.4125C34.0208 27.8042 33.55 28 33 28H19ZM21 26H31C31 25.45 31.1958 24.9792 31.5875 24.5875C31.9792 24.1958 32.45 24 33 24V20C32.45 20 31.9792 19.8042 31.5875 19.4125C31.1958 19.0208 31 18.55 31 18H21C21 18.55 20.8042 19.0208 20.4125 19.4125C20.0208 19.8042 19.55 20 19 20V24C19.55 24 20.0208 24.1958 20.4125 24.5875C20.8042 24.9792 21 25.45 21 26ZM32 32H15C14.45 32 13.9792 31.8042 13.5875 31.4125C13.1958 31.0208 13 30.55 13 30V19H15V30H32V32Z" fill="#E8EAED" />
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_1139_10877" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_1139_10877">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>
                            AddBank</button>
                            <button className={styles.modalbutton} onClick={handleTopUp}> <svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_1139_10861)" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M30 32H18C16.895 32 16 31.105 16 30V18C16 16.895 16.895 16 18 16H30C31.105 16 32 16.895 32 18V30C32 31.105 31.105 32 30 32Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24 20V28" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M28 24H20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <defs>
                              <linearGradient id="paint0_linear_1139_10861" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                            </defs>
                          </svg>

                            TopUp</button>
                          <button className={styles.modalbutton} onClick={handleWithDraw}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_1139_10869)" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M30 32H18C16.895 32 16 31.105 16 30V18C16 16.895 16.895 16 18 16H30C31.105 16 32 16.895 32 18V30C32 31.105 31.105 32 30 32Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M28 24H20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <defs>
                              <linearGradient id="paint0_linear_1139_10869" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                            </defs>
                          </svg>

                            WithDraw</button>
                          <button className={styles.modalbutton} onClick={handleTransfor}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_1139_10873)" />
                            <g clip-path="url(#clip0_1139_10873)">
                              <path d="M30.0189 24.019L31.7489 22.289C32.1553 21.8947 32.4792 21.4236 32.7018 20.903C32.9244 20.3824 33.0412 19.8228 33.0455 19.2566C33.0498 18.6904 32.9414 18.1291 32.7267 17.6052C32.512 17.0813 32.1953 16.6053 31.795 16.2049C31.3946 15.8046 30.9186 15.4879 30.3947 15.2732C29.8708 15.0585 29.3095 14.9501 28.7433 14.9544C28.1771 14.9587 27.6175 15.0755 27.0969 15.2981C26.5763 15.5207 26.1051 15.8446 25.7109 16.251L22.0109 19.951C21.6143 20.3474 21.2996 20.818 21.0849 21.336C20.8703 21.854 20.7598 22.4093 20.7598 22.97C20.7598 23.5307 20.8703 24.086 21.0849 24.604C21.2996 25.122 21.6143 25.5926 22.0109 25.989L21.9999 26C22.3449 26.338 22.7449 26.614 23.1829 26.817" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M24.8062 21.193C25.2442 21.396 25.6442 21.673 25.9892 22.011C26.3858 22.4074 26.7005 22.878 26.9152 23.396C27.1298 23.914 27.2403 24.4693 27.2403 25.03C27.2403 25.5907 27.1298 26.146 26.9152 26.664C26.7005 27.182 26.3858 27.6526 25.9892 28.049L22.2892 31.749C21.4844 32.5298 20.4048 32.9627 19.2836 32.9542C18.1623 32.9457 17.0894 32.4965 16.2966 31.7036C15.5037 30.9108 15.0545 29.8379 15.046 28.7166C15.0375 27.5954 15.4704 26.5158 16.2512 25.711L17.9812 23.981" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M16 16L18 14L20 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M18 20L18 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_1139_10873" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_1139_10873">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>

                            Transfer</button>            
                            <button className={styles.modalbutton} onClick={handleSwap}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_1139_10865)" />
                            <g clip-path="url(#clip0_1139_10865)">
                              <path d="M29.5 33.5L28 32L29.5 30.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M28 32H30C30.7956 32 31.5587 31.6839 32.1213 31.1213C32.6839 30.5587 33 29.7956 33 29" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M18.5 14.5L20 16L18.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M20 16H18C17.2044 16 16.4413 16.3161 15.8787 16.8787C15.3161 17.4413 15 18.2044 15 19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M26 25V29.554C26 29.9375 25.8477 30.3053 25.5765 30.5765C25.3053 30.8477 24.9375 31 24.554 31H16.446C16.0625 31 15.6947 30.8477 15.4235 30.5765C15.1523 30.3053 15 29.9375 15 29.554V24.446C15 24.0625 15.1523 23.6947 15.4235 23.4235C15.6947 23.1523 16.0625 23 16.446 23H24C24.5304 23 25.0391 23.2107 25.4142 23.5858C25.7893 23.9609 26 24.4696 26 25Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M20.5 28.5C21.3284 28.5 22 27.8284 22 27C22 26.1716 21.3284 25.5 20.5 25.5C19.6716 25.5 19 26.1716 19 27C19 27.8284 19.6716 28.5 20.5 28.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M22 20V18.446C22 18.0625 22.1523 17.6947 22.4235 17.4235C22.6947 17.1523 23.0625 17 23.446 17H31C31.5304 17 32.0391 17.2107 32.4142 17.5858C32.7893 17.9609 33 18.4696 33 19V23.554C33 23.9375 32.8477 24.3053 32.5765 24.5765C32.3053 24.8477 31.9375 25 31.554 25H29" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M26.4404 19.94C26.5778 19.7926 26.7434 19.6744 26.9274 19.5924C27.1114 19.5105 27.31 19.4664 27.5114 19.4628C27.7128 19.4593 27.9128 19.4963 28.0996 19.5718C28.2864 19.6472 28.4561 19.7595 28.5985 19.9019C28.7409 20.0444 28.8532 20.214 28.9287 20.4008C29.0041 20.5876 29.0412 20.7876 29.0376 20.989C29.0341 21.1905 28.99 21.3891 28.908 21.5731C28.826 21.7571 28.7078 21.9227 28.5604 22.06" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_1139_10865" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_1139_10865">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>

                            Swap</button>
                        </div>
                        <button className={styles.closebutton} onClick={closeModal}>
                                    <button className={styles.closeButton2} onClick={closeModal}>
                          <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
                        </button>
                          {/* <svg width="49" height="70" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="24.6758" cy="24" r="24" fill="url(#paint0_linear_348_4905)" />
                          <path d="M17.0833 34.5416L15.0684 32.5267L23.1281 24.467L15.0684 16.4073L17.0833 14.3923L25.143 22.452L33.2027 14.3923L35.2176 16.4073L27.1579 24.467L35.2176 32.5267L33.2027 34.5416L25.143 26.4819L17.0833 34.5416Z" fill="white" />
                          <defs>
                            <linearGradient id="paint0_linear_348_4905" x1="0.675781" y1="0" x2="0.675781" y2="40" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#E34D67" />
                              <stop offset="1" stop-color="#7746F4" />
                            </linearGradient>
                          </defs>
                        </svg> */}
                        </button>
                      </div>
                    </div>)}
                </div>
              )}
        {activeTab === 'NFTs' && <div>NFTs is in Under Construction </div>}
      </div>
      {/* {dropdownVisible && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <div className={styles.Wallets}>
              Wallets
              
              <hr style={{ color: 'gray', position: 'relative', top: '0px'}} />
              <h4 className={styles.Wallet1}>
                Wallet 1
              </h4>
            </div>
            <div className={styles.dropdownItem}>
             <button onClick={() => handleNavigation('/UserProfile')}>
             {profileImage ? (
                <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
              ) : (
                <FaUserCircle className={styles.profileIcon1} />
              )}
             </button>
              <div className={styles.textContainer}>
                <div className={styles.userid}>
                  <Typography variant="body1" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px', position: 'relative', bottom: '25px' }}>
                    {userId}
                  </Typography>
                </div>
                <div className={styles.profilesettingdiv}>
                <button onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')}>
                <RiUserSettingsFill className={styles.profilesettingicon} />
                </button>
              </div>
                <div>
                  <span style={{ marginLeft: '8px', position: 'relative', top: '-55px'}}>$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
       </>
      )}
      <div className={styles.homeInner} >
            <LottieAnimation width="33.4px" height="33.4px" />
        </div>
            <div className={styles.tabbarstabbars}>    
            {/* <img className={styles.frameIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074021/Frame_mp4g4t.png" /> */}
        				<div className={styles.div}>
          					<div className={styles.content11} onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/transaction_btn')}>
                        <AssessmentIcon />
            						<b className={styles.text}>Transaction</b>
          					</div>
        				</div>
        				<div className={styles.div1} >
          					<div className={styles.content12} >
            						<img className={styles.iconbase}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" />
            						<b className={styles.text}>Dupay</b>
          					</div>
        				</div>
        				<div className={styles.div1}>
                <div className={styles.content11}  onClick={() => handleNavigation('/UserProfile/ViewProfile')}>
          					{/* <div className={styles.content11}  onClick={() => handleNavigation('/Userauthorization/Dashboard/Settings')}> */}
            						{/* <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" /> */}
                        {/* <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728993690/profile_iwqu3x.png" /> */}
                        <FaUserCircle style={{width: '22px', height: '22px'}}/>
            						<b className={styles.text}>Profile</b>
          					</div>
        				</div>
      			</div>
        <div>
          {isDupayOpen && (
          <div className={styles.overlay}>
            <div className={styles.blurBackground}></div>
            <div className={styles.buttonsContainer}>
              <div
                className={styles.button}
                onClick={() => {
                  handleNavigation('/Userauthorization/cashout_btn');
                  handleClose(); // Close the blur screen
                }}
              >
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085076/cashout_icon_h0h6vj.png" alt="Cashout" style={{ position: 'relative', right: '-19px' }} />
                {/* <span>Cashout</span> */}
                <div style={{ marginLeft: '26px', fontFamily: 'Roboto, sans-serif',position: 'relative', left: '3px' }}>Cashout</div>

              </div>
              <div
                className={styles.button}
                onClick={() => {
                  handleNavigation(`/CryptoTransactions/CryptoSwap?user_id=${userId}`);
                  handleClose(); // Close the blur screen
                }}
              >
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085724/swap_icon_v5uzcz.png" alt="Swap" style={{ position: 'relative', right: '3px',width: '29px', height: '29px'}} />
                <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', left: '7px' }}>Swap</div>
              </div>
              <div
                className={styles.button}
                onClick={() => {
                  handleNavigation('/Userauthorization/send_btn');
                  handleClose(); // Close the blur screen
                }}
              >
                 <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085858/Send_icon_zag3am.png" alt="Send" style={{ width: '20px', height: '20px', position: 'relative', right: '5px' }} />
                <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', left: '13px' }}>Send</div>
              </div>
              <div
                className={styles.button}
                onClick={() => {
                  handleNavigation(`/CryptoTransactions/CryptoSell?user_id=${userId}`);
                  handleClose(); // Close the blur screen
                }}
              >
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729837576/loan_1_g0wn70.png" alt="Receive" style={{ width: '30px', height: '30px', position: 'relative', right: '0px' }} />
                <div style={{ marginLeft: '20px', fontFamily: 'Roboto, sans-serif', position: 'relative',left: '-8px' }}>Sell</div>
              </div>
              <div
                className={styles.button}
                onClick={() => {
                  handleNavigation('/WalletManagement/Transak'); 

                  handleClose(); // Close the blur screen
                }}
              >
               
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086014/Buy_icon_rwmfdq.png" alt="Buy" style={{ position: 'relative', right: '9px' }} />
                <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', left: '3px' }}>Buy</div>
              </div>
            </div>
            {/* Close button */}
            <button className={styles.closeButton1} onClick={handleClose}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
            </button>
          </div>
        )}

       {addNewFiatWalletPage && (
        <div className={styles.backdrop}>
        <div className={styles.modalContentadd}>
          <div className={styles.addNewFiatWalletPage}>
            <h2>Create New Fiat Wallet</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* <div className={styles.formGroup}>
                <Select
                  id="accountType"
                  className={styles.selectInput}
                  options={accountTypeOptions}
                  value={selectedAccountType}
                  onChange={(option) => setSelectedAccountType(option)}
                  placeholder="Select an account type"
                  isClearable
                  required
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: 'rgba(42, 45, 60, 1)',
                      color: 'rgba(226, 240, 255, 1)',
                      border: 'none',
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: 'rgba(226, 240, 255, 1)',
                      textAlign: 'left', // Align placeholder to the left
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#333' : 'rgba(42, 45, 60, 1)',
                      color: 'white',
                      textAlign: 'left',
                      '&:hover': {
                        backgroundColor: '#555',
                      },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: 'rgba(226, 240, 255, 1)',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: 'rgba(42, 45, 60, 1)',
                      border: 'none',
                      boxShadow: 'none',
                    }),
                    menuList: (provided) => ({
                      ...provided,
                      backgroundColor: 'rgba(42, 45, 60, 1)',
                      padding: 0,
                      border: 'none',
                    }),
                  }} */}
                {/* /> */}
              {/* </div> */}
              <div className={styles.formGroup}>
                <input
                  id="walletName"
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  placeholder="Wallet name"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Email address"
                  className={styles.input}
                  required
                />
                {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <span className={styles.error}>Please enter a valid email address</span>
                )}
              </div>
              <div className={styles.formGroup}>
                <input
                  id="securityPin"
                  type="password"
                  maxLength={4}
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="Security PIN"
                  className={styles.input}
                  required
                />
                {securityPin && securityPin.length !== 4 && (
                  <span className={styles.error}>PIN must be exactly 4 digits</span>
                )}
              </div>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || securityPin.length !== 4}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
        </div>
      )}
      


      </div>
    </div>
  );
};


export default Home;