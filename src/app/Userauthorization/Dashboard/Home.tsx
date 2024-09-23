"use client";
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExchangeAlt, faWallet, faListAlt, faCog, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import styles from './Home.module.css';
import { styled } from '@mui/material/styles';
import { redirect } from 'next/navigation';
import { FaCircleArrowDown } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { RiUserSettingsFill } from "react-icons/ri";
import { color, fontSize } from '@mui/system';
import { json } from 'stream/consumers';
import { BsBank2 } from "react-icons/bs";
import { PiHandWithdraw } from 'react-icons/pi'; 
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";
import { BiTransfer } from "react-icons/bi";
import { LuPlusCircle } from "react-icons/lu";





interface FiatWallet {
  // fiat_wallet_address: string;
  // fiat_wallet_balance: string;
  // fiat_wallet_created_time: string;
  // fiat_wallet_currency: string;
  // fiat_wallet_email: string;
  // fiat_wallet_id: string;
  // fiat_wallet_phone_number: string;
  // fiat_wallet_type: string;
  // fiat_wallet_updated_time: string;
  // qr_code: string;
  // user_id: string;
  
balance: string; 
currency_type: string;
wallet_id: string;
}

interface FiatWalletData{
  fiat_wallet_id: string;
}

const currencySymbols: { [key: string]: string } = {
  'INR': '₹',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
};

// Dynamic imports
const Headerbar = dynamic(() => import('./Headernavbar/headernavbar'), {
  loading: () => <div>Loading Header...</div>,
});
const FaUserCircle = dynamic(() => import('react-icons/fa').then((mod) => mod.FaUserCircle));

const IoCashOutline = dynamic(() => import('react-icons/io5').then((mod) => mod.IoCashOutline));
const FaArrowUpLong = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaArrowUpLong));
const FaArrowDownLong = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaArrowDownLong));
const RiBankLine = dynamic(() => import('react-icons/ri').then((mod) => mod.RiBankLine));
const IoMdSend = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdSend));
const IoMdWallet = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdWallet));

interface UserProfileData {
  user_id: string;
  user_profile_photo?: string | { data: number[] };
}

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

  const [isFiatTabSelected, setIsFiatTabSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });
  const [userId, setUserId] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);
  const [walletData, setWalletData] = useState<FiatWallet[]>([]);
  const [fiatwalletData, setFiatWalletData] = useState<FiatWalletData[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId = sessionData.user_id;
        setUserId( storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
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
        console.log('session data',fiatwalletData)
      }
    }
  })

  // useEffect(() => {
  //   // On component mount, check localStorage for the active tab
  //   const savedTab = localStorage.getItem('activeTab');
  //   const savedDropdownState = localStorage.getItem('dropdownOpen') === 'true';

  //   if (savedTab === 'Fiat') {
  //     setActiveTab(savedTab); // Restore the active tab
  //     setIsFiatTabSelected(true);
  //   }
  //   setFiatDropdownVisible(savedDropdownState); // Restore the dropdown state

  // }, []);

   // Restore state on component mount
   useEffect(() => {
    const savedTab = localStorage.getItem('activeTab') || 'Crypto';
    const savedCryptoDropdownState = localStorage.getItem('cryptoDropdownOpen') === 'true';
    const savedFiatDropdownState = localStorage.getItem('fiatDropdownOpen') === 'true';

    setActiveTab(savedTab);
    setDropdownVisible(savedCryptoDropdownState); // Restore Crypto dropdown state
    setFiatDropdownVisible(savedFiatDropdownState); // Restore Fiat dropdown state

    if (savedTab === 'Fiat') {
      setFiatDropdownVisible(savedFiatDropdownState); // Show Fiat dropdown if active
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

  // const handleTabClick = async (tab: string) => {
   
  //   if (tab === 'Fiat') {
  //     setIsFiatTabSelected(true);
  //     setActiveTab(tab); // Update active tab state
  //     localStorage.setItem('activeTab', 'Fiat');
  //     setActiveTab(tab); // Update active tab state
  //     localStorage.setItem('activeTab', tab); // Save active tab to localStorage

  //     if (!fiatWalletId) {
  //       // Show registration alert first with mobile screen dimensions and centered design
  //       const result = await Swal.fire({
  //         text: "You haven't created Fiat wallet. Would you like to create it?",
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes, register',
  //         cancelButtonText: 'No, thanks',
  //         customClass: {
  //           popup: styles.mobilePopup, 
  //           confirmButton: styles.confirmButton,
  //           cancelButton: styles.cancelButton,
  //         },
  //         backdrop: 'rgba(0, 0, 0, 0.2)',
  //         showClass: {
  //           popup: styles.showPopupAnimation
  //         },
  //         hideClass: {
  //           popup: styles.hidePopupAnimation 
  //         }
  //       });
  
  //       if (result.isConfirmed) {
  //         setLoading(true); 
  //         setTimeout(() => {
  //           router.push('/FiatManagement/FiatWalletAccount/');
  //           setLoading(false);
  //         }, 2000);
  //       } else {
  //         setFiatDropdownVisible(true);
  //       }
  //     } else {
  //       setFiatDropdownVisible(true);
  //       // setFiatDropdownVisible(false);
  //       localStorage.setItem('dropdownOpen', 'false');
  //     }
  //   } else {
  //     setIsFiatTabSelected(false);
  //     localStorage.setItem('activeTab', tab);
  //     setFiatDropdownVisible(false);
  //     localStorage.setItem('dropdownOpen', 'false');
  //   }
  
  //   setActiveTab(tab);
  //   setIsFiatTabSelected(tab === 'Fiat');
  // };
  


  const handleTabClick = async (tab: string) => {
    if (tab === 'Fiat') {
      setIsFiatTabSelected(true);
      setActiveTab(tab);
      localStorage.setItem('activeTab', 'Fiat');

      if (!fiatWalletId) {
        const result = await Swal.fire({
          text: "You haven't created a Fiat wallet. Would you like to create it?",
          showCancelButton: true,
          confirmButtonText: 'Yes, register',
          cancelButtonText: 'No, thanks',
          customClass: {
            popup: styles.mobilePopup,
            confirmButton: styles.confirmButton,
            cancelButton: styles.cancelButton,
          },
          backdrop: 'rgba(0, 0, 0, 0.2)',
        });

        if (result.isConfirmed) {
          setLoading(true);
          setTimeout(() => {
            router.push('/FiatManagement/FiatWalletAccount/');
            setLoading(false);
          }, 2000);
        } else {
          setFiatDropdownVisible(true);
          localStorage.setItem('fiatDropdownOpen', 'true');
        }
      } else {
        setFiatDropdownVisible(true);
        localStorage.setItem('fiatDropdownOpen', 'true');
      }
    } else {
      setIsFiatTabSelected(false);
      setActiveTab(tab);
      localStorage.setItem('activeTab', tab);

      if (tab === 'Crypto') {
        setFiatDropdownVisible(false);
        setDropdownVisible(true);
        localStorage.setItem('fiatDropdownOpen', 'false'); // Close Fiat dropdown
        localStorage.setItem('cryptoDropdownOpen', 'true'); // Open Crypto dropdown
      } else {
        setFiatDropdownVisible(false);
        setDropdownVisible(false);
        localStorage.setItem('fiatDropdownOpen', 'false'); // Close Fiat dropdown
        localStorage.setItem('cryptoDropdownOpen', 'false'); // Close Crypto dropdown
      }
    }
  };

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
  

const handleButtonClick = (buttonName: string) => {

    const navigateWithLoading = (route: string) => {
      setLoading(true); 
      setTimeout(() => {
        router.push(route);
        setLoading(false);
      }, 2000);
    };
    
    const routes: { [key: string]: string }  = {
      'Add Bank': '/FiatManagement/AddBanks',
      'Wallet': '/Userauthorization/wallet',
      'Swap': '/FiatManagement/FiatSwap',
      'Transfer': '/TransactionType/WalletTransactionInterface',
    };
  
    if (buttonName === 'Deposit') {
      router.push(routes[buttonName]);
    } else if (buttonName in routes) {
      navigateWithLoading(routes[buttonName]);
    } else {
      console.log('No route defined for this button');
    }
  };

  useEffect(() => {
    fetchUserProfile();
    if (userId) {
      fetchFiatWalletId();
    }
  }, [userId]); 

      const fetchFiatWalletId = async () => {
        try {
          // const response = await axios.get(`http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/fiat_wallets_fetch/${userId}/`);
          const response = await axios.get(`http://127.0.0.1:8000/userauthorizationapi/fiat_wallets_fetch/${userId}/`);

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

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/profile/${userId}/`);
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
  // const toggleDropdown = () => {
  //   setDropdownVisible(!dropdownVisible);    
  //   const newDropdownState = !fiatDropdownVisible;
  //   setFiatDropdownVisible(newDropdownState);
  //   localStorage.setItem('dropdownOpen', newDropdownState.toString()); // Persist dropdown state
  
  // };
 // Toggle dropdown function for Crypto and Fiat tabs
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

  const handleIconClick = (iconName: string) => {
    if (iconName === 'Fiat') {
      setFiatDropdownVisible(!fiatDropdownVisible);
    } else {
      switch (iconName) {
        case 'Buy':
          setLoading(true);
          setTimeout(() => {
          window.location.href = '/WalletManagement/Transak';
          setLoading(false);
        }, 2000);
          break;
        case 'Swap':
          setLoading(true);
          setTimeout(() => {
          router.push('/Userauthorization/swap_btn');
          setLoading(false);
        }, 2000);
          break;
        case 'Cashout':
          setLoading(true);
          setTimeout(() => {
          router.push('/Userauthorization/cashout_btn');
          setLoading(false);
        }, 4000);
          break;
        case 'Send':
          setLoading(true);
          setTimeout(() => {
          router.push('/Userauthorization/send_btn');
          setLoading(false);
        }, 2000);
          break;
        case 'Receive':
          setLoading(true);
          setTimeout(() => {
          router.push('/Userauthorization/receive_btn');
          setLoading(false);
        }, 2000);
          break;
        default:
          break;
      }
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
    handleIconClick('Add crypto');
    router.push('/Userauthorization/Dashboard/addcrypto_btn'); // Ensure the correct path here
  };
    const handleNavigation = (route: string) => {
    setLoading(true); 
    setTimeout(() => {
      router.push(route); 
      setLoading(false);
    }, 2000);
  };
  const handlebuyclick = () => {
    setLoading(true); 
    
    setTimeout(() => {
      if (userId !== fetchedUserId) {
        router.push('/Userauthorization/Dashboard/cryptowallet');
      } else {
        router.push('/FiatManagement/DepositForm');
      }
      setLoading(false); 
    }, 3000); 
  };

  const handleCopyUserId = () => {
    if (userId !== null){
    navigator.clipboard.writeText(userId);}
  };

  const ProfileImage = styled('img')({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '5px',
    border: '2px solid white',
  });

  const handleButtonClickblur = () => {
    setIsBlurred(true); // Trigger the blur effect when any button is clicked
  };

  const closeModal = () => {
    setIsBlurred(false); // Close the modal and remove the blur effect
  };


  useEffect(() => {
    // Fetch data from the API
    axios
      // .get<{ fiat_wallets: FiatWallet[] }>(`http://fiatmanagement-ind-255574993735.asia-south1.run.app/Fiat_Currency/fiat_wallet/Wa0000000006/`)
      .get<{ fiat_wallets: FiatWallet[] }>(`http://127.0.0.1:8000/Fiat_Currency/fiat_wallet/${fiatwalletData}/`)
      .then((response) => {
        console.log('responsed data',response.data);
        setWalletData(response.data.fiat_wallets); // Set the array of wallets to state
        setLoading(false); // Stop the loading state
      })
      .catch((err) => {
        // setError(err.message); // Set the error if request fails
        setLoading(false); // Stop the loading state
      });
  }, []);


  return (
    // <div className={styles.container}>
    <div className={`${styles.container} ${isBlurred ? styles.blur : ''}`}>
       {loading ? (
        <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        </div>
      ) : (
        <>
      <header>
        {/* Header content here */}
      </header>
      <div className={styles.header}>
        <div className={styles.leftSection} >
          <div className={styles.walletAddress} >
            {profileImage ? (
              <ProfileImage src={profileImage} alt="Profile Image" />
            ) : (
              <FaUserCircle className={styles.profileIcon} />
            )}
            <Typography variant="body1" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px' }}>
              {userId}
            </Typography>
            {/* <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} /> */}
          </div>
        </div>
        <div className={styles.rightSection}>
            <header className={styles.righttopicons}>
                {/* <Headerbar userId={userId} onCopyUserId={handleCopyUserId} /> */}
            </header>
    </div>
      </div>
      <div className={styles.balance}>
          {(userId === fetchedUserId && fiatWalletId) ? (
              <button onClick={handlebuyclick}>
              {isFiatTabSelected ? (
                <div>{fiatWalletBalance ? `₹${parseFloat(fiatWalletBalance).toFixed(3)}` : '₹0.00'}</div>
              ) : (
                <div>₹0.00</div>
              )}
            </button>
          ) : (
              <button onClick={handlebuyclick}>
                  <div>₹0.00</div>
              </button>
          )}
      </div>
      <div className={styles.actions}>
        {isFiatTabSelected ? (
          <div className={styles.buttonContainer}>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Add Bank')}>
              <RiBankLine className={styles.icon} />
              <div className={styles.buttonLabel}>Add Bank</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Wallet')}>
              <IoMdWallet className={styles.icon} />
              <div className={styles.buttonLabel}>Wallet</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Swap')}>
              <FontAwesomeIcon icon={faExchangeAlt} className={styles.icon} />
              <div className={styles.buttonLabel}>Swap</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Transfer')}>
              <IoMdSend className={styles.icon} />
              <div className={styles.buttonLabel}>Transfer</div>
            </button>
          </div>
        ) : (
          <>
            {[ 'Buy', 'Swap', 'Send', 'Receive', 'Cashout'].map(action => (
              <button
                key={action}
                className={`${styles.actionButton} ${activeAction === action ? styles.activeAction : ''}`}
                onClick={() => {
                  // setActiveAction(action);
                  handleIconClick(action);
                }}
              >
                {getIcon(action)}
                <span>{action}</span>
              </button>
            ))}
          </>
        )}
      </div>

            {/* <div className={styles.tabs}>
              {['Crypto', 'Fiat', 'NFTs'].map(tab => (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.activeTab : styles.tab}
                  onClick={() => handleTabClick(tab)}
                >
                  {(tab  === 'Fiat') && (
                    // <div onClick={toggleDropdown}  >
                    //   {fiatDropdownVisible ? 'Hide' : 'Show'}
                    // </div>
                    <div 
                      onClick={toggleDropdown} 
                      style={{ visibility: fiatDropdownVisible ? 'hidden' : 'hidden' }}
                    >
                      {fiatDropdownVisible ? 'Hide' : 'Show'}
                    </div>

                  )}
                  {tab}
                </button>
              ))}
            </div> */}
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
        {activeTab === 'Crypto' && (
          <div className={styles.cryptoContent}>
            <div className={styles.cryptoIcons}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726049066/Crypto_image_wceong.png" alt="Crypto Icon 1" className={styles.cryptoIcon} />
            </div>
            <div className={'button-container'}>
              <h2 className={styles.addNameStart}>Add crypto to get started</h2>
              <button className={styles.addCryptoButton} onClick={handleAddCryptoClick}>
                Add crypto
              </button>
            </div>
          </div>
        )}
        {activeTab === 'Fiat' && fiatDropdownVisible && (
          // <div ref={fiatDropdownRef} className={styles.fiatDropdown}>
          //   <div className={styles.dropdownContent1}>
          //     <div style={{fontSize: '20px'}}>   Fiat Accounts  </div>
          //     <hr style={{ color: 'gray' }} />
          //     <div className={styles.dropdownItem}>
          //      <button onClick={() => handleNavigation('/UserProfile/FiatViewProfile')}>
          //      {profileImage ? (
          //         <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
          //       ) : (
          //         <FaUserCircle className={styles.profileIcon2} />
          //       )}
          //      </button>
          //       <div className={styles.textContainer}>
          //         <div className={styles.userid}>
          //         <Typography variant="h6" style={{ position: 'relative', bottom: '15px' }}>
          //             {userId === fetchedUserId ? (
          //                 fiatWalletId ? (
          //                     <>
          //                         <div>{fiatWalletId}</div>
          //                         <div>{fiatWalletBalance ? `₹${parseFloat(fiatWalletBalance).toFixed(3)}` : '₹0.00'}</div>
          //                     </>
          //                 ) : (
          //                   <div style={{ whiteSpace: 'pre-line' , fontSize: '16px'}}>
          //                   Loading...
          //                 </div>
          //                 )
          //             ) : (
          //               <div style={{ whiteSpace: 'pre-line', fontSize: '16px'}}>
          //               Loading.....
          //             </div>
          //             )}
          //         </Typography>              
          //         </div>
          //         <div>
          //             <span style={{ marginLeft: '0px', position: 'relative', bottom: '15px' }}>
          //               {userId === fetchedUserId ? '' : '₹0.00'}
          //             </span>
          //         </div>
          //         <div className={styles.buttonContainer1}>
          //           <div>
          //             <button className={styles.viewprofileButton1} onClick={() => handleNavigation('/FiatManagement/DepositForm')}>
          //             <IoMdAddCircle className={styles.icon1}/>
          //               <span className={styles.text1}>Top-up</span>
          //             </button>
          //           </div>
          //           <div>
          //             <button className={styles.manageWalletsButton1} onClick={() => handleNavigation('/FiatManagement/WithdrawForm')}>
          //             <FaCircleArrowDown className={styles.icon2}/>
          //               <span className={styles.text2}>Withdraw</span>
          //             </button>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <div>
          <div className={styles.fiat}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr className={styles.tr}>
                <th className={styles.th} >Currency</th>
                <th className={styles.th} >Balance</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {['INR', 'USD', 'GBP', 'EUR'].map((currency, index) => {
                // Find wallet data matching the current currency
                const wallet = walletData.find((w: { currency_type: string; }) => w.currency_type === currency);
                const balance = wallet ? Number(wallet.balance).toFixed(2) : '0.00';
        
                return (
                  <tr className={styles.trd} key={index}>
                    <td className={styles.td}>
                    <button className={styles.buttond} onClick={handleButtonClickblur}>{currency}</button>
                    </td>
                    <td className={styles.td}>
                      <button className={styles.buttond} onClick={handleButtonClickblur}>{`${currencySymbols[currency] || ''}${balance}`}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
                  {isBlurred && (
                    <div className={styles.modaloverlay}>
                      <div className={styles.modalcontent}>
                        <div className={styles.modalbuttons}>
                          <button className={styles.modalbutton}><svg className={styles.svg} width="48"  height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_348_4902)"
                            />
                            {/* Replace the existing <path> with the BsBank2 icon */}
                            <g clipPath="url(#clip0_348_4902)">
                              <foreignObject x="12" y="12" width="24" height="24">
                                <BsBank2 size="24" color="#E8EAED" />
                              </foreignObject>
                            </g>
                            <defs>
                              <linearGradient
                                id="paint0_linear_348_4902"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="48"
                                gradientUnits="userSpaceOnUse"
                              >
                                <stop stopColor="#E34D67" />
                                <stop offset="1" stopColor="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_348_4902">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>
                            AddBack</button>
                          <button className={styles.modalbutton}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_348_4890)" />
                            <g clip-path="url(#clip0_348_4890)">
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
                              <linearGradient id="paint0_linear_348_4890" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#E34D67" />
                                <stop offset="1" stop-color="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_348_4890">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>
                            Swap</button>
                          <button className={styles.modalbutton}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_348_4902)" />
                            <g clip-path="url(#clip0_348_4902)">
                              {/* Removed the old path and replaced it with the PiHandWithdraw icon */}
                              <foreignObject x="12" y="12" width="24" height="24">
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                  <PiHandWithdraw size={24} color="#E8EAED" />
                                </div>
                              </foreignObject>
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_348_4902" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E34D67" />
                                <stop offset="1" stopColor="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_348_4902">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>
                            WithDraw</button>
                          <button className={styles.modalbutton}><svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_348_4902)" />
                            {/* Instead of using the <path>, we render the BiTransfer icon here */}
                            <foreignObject x="12" y="12" width="24" height="24">
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                                <BiTransfer color="#E8EAED" size="24px" />
                              </div>
                            </foreignObject>
                            <defs>
                              <linearGradient id="paint0_linear_348_4902" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E34D67" />
                                <stop offset="1" stopColor="#7746F4" />
                              </linearGradient>
                            </defs>
                          </svg>
                            Transfor</button>
                          <button className={styles.modalbutton}> <svg className={styles.svg} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="url(#paint0_linear_348_4902)" />
                            <g clipPath="url(#clip0_348_4902)">
                              {/* Remove the path here */}
                              <foreignObject x="12" y="12" width="24" height="24">
                                <LuPlusCircle style={{ width: '100%', height: '100%', color: '#E8EAED' }} />
                              </foreignObject>
                            </g>
                            <defs>
                              <linearGradient id="paint0_linear_348_4902" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#E34D67" />
                                <stop offset="1" stopColor="#7746F4" />
                              </linearGradient>
                              <clipPath id="clip0_348_4902">
                                <rect width="24" height="24" fill="white" transform="translate(12 12)" />
                              </clipPath>
                            </defs>
                          </svg>
                            TopUp</button>
                        </div>
                        <button className={styles.closebutton} onClick={closeModal}><svg width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="24.6758" cy="24" r="24" fill="url(#paint0_linear_348_4905)" />
                          <path d="M17.0833 34.5416L15.0684 32.5267L23.1281 24.467L15.0684 16.4073L17.0833 14.3923L25.143 22.452L33.2027 14.3923L35.2176 16.4073L27.1579 24.467L35.2176 32.5267L33.2027 34.5416L25.143 26.4819L17.0833 34.5416Z" fill="white" />
                          <defs>
                            <linearGradient id="paint0_linear_348_4905" x1="0.675781" y1="0" x2="0.675781" y2="48" gradientUnits="userSpaceOnUse">
                              <stop stop-color="#E34D67" />
                              <stop offset="1" stop-color="#7746F4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        </button>
                      </div>
                    </div>)}
                </div>
              )}
        {activeTab === 'NFTs' && <div>NFTs Content</div>}
      </div>
      {dropdownVisible && (
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
      )}
       </>
      )}
    </div>
  );
};

const getIcon = (action: string) => {
  switch (action) {
    case 'Buy':
      return <FontAwesomeIcon icon={faPlus} />;
    case 'Swap':
      return <FontAwesomeIcon icon={faExchangeAlt} />;
    case 'Cashout':
      return <IoCashOutline style={{fontSize: '30px'}} />;
    case 'Send':
      return <FaArrowUpLong />;
    case 'Receive':
      return <FaArrowDownLong />;
    case 'Assets':
      return <FontAwesomeIcon icon={faWallet} />;
    case 'Transactions':
      return <FontAwesomeIcon icon={faListAlt} />;
    case 'Settings':
      return <FontAwesomeIcon icon={faCog} />;
    default:
      return null;
  }
};

export default Home;