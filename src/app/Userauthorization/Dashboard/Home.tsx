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

// interface UserProfileData {
//   user_id: string;
//   user_profile_photo?: string | { data: number[] };
// }

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
  const userId = 'DupC0001';
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fiatDropdownRef = useRef<HTMLDivElement | null>(null);

  const [isFiatTabSelected, setIsFiatTabSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });
  // const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      // if (sessionDataString) {
      //   const sessionData = JSON.parse(sessionDataString);
      //   const storedUserId = sessionData.user_id;
      //   setUserId( storedUserId);
      //   console.log(storedUserId);
      //   console.log(sessionData.user_email);
      // } else {
      //   // redirect('http://localhost:3000/Userauthentication/SignIn');
      // }
    }
  }, []);

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
          // router.push('/Userauthorization/Dashboard/buy_btn');
          window.location.href = '/WalletManagement/Transak';
          break;
        case 'Swap':
          router.push('/Userauthorization/swap_btn');
          break;
        case 'Cashout':
          router.push('/Userauthorization/cashout_btn');
          break;
        case 'Send':
          router.push('/Userauthorization/send_btn');
          break;
        case 'Receive':
          router.push('/Userauthorization/receive_btn');
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
    navigator.clipboard.writeText(userId);
  };

  const ProfileImage = styled('img')({
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '5px',
    border: '2px solid white',
  });

  return (
    <div className={styles.container}>
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
            <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
          </div>
        </div>
        <div className={styles.rightSection}>
            <header className={styles.righttopicons}>
                <Headerbar userId={userId} onCopyUserId={handleCopyUserId} />
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
          <div ref={fiatDropdownRef} className={styles.fiatDropdown}>
            <div className={styles.dropdownContent1}>
              <div style={{fontSize: '20px'}}>   Fiat Accounts  </div>
              <hr style={{ color: 'gray' }} />
              <div className={styles.dropdownItem}>
               <button onClick={() => handleNavigation('/UserProfile/FiatViewProfile')}>
               {profileImage ? (
                  <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
                ) : (
                  <FaUserCircle className={styles.profileIcon2} />
                )}
               </button>
                <div className={styles.textContainer}>
                  <div className={styles.userid}>
                  <Typography variant="h6" style={{ position: 'relative', bottom: '15px' }}>
                      {userId === fetchedUserId ? (
                          fiatWalletId ? (
                              <>
                                  <div>{fiatWalletId}</div>
                                  <div>{fiatWalletBalance ? `₹${parseFloat(fiatWalletBalance).toFixed(3)}` : '₹0.00'}</div>
                              </>
                          ) : (
                            <div style={{ whiteSpace: 'pre-line' , fontSize: '16px'}}>
                            Loading...
                          </div>
                          )
                      ) : (
                        <div style={{ whiteSpace: 'pre-line', fontSize: '16px'}}>
                        Loading.....
                      </div>
                      )}
                  </Typography>              
                  </div>
                  <div>
                      <span style={{ marginLeft: '0px', position: 'relative', bottom: '15px' }}>
                        {userId === fetchedUserId ? '' : '₹0.00'}
                      </span>
                  </div>
                  <div className={styles.buttonContainer1}>
                    <div>
                      <button className={styles.viewprofileButton1} onClick={() => handleNavigation('/FiatManagement/DepositForm')}>
                      <IoMdAddCircle className={styles.icon1}/>
                        <span className={styles.text1}>Top-up</span>
                      </button>
                    </div>
                    <div>
                      <button className={styles.manageWalletsButton1} onClick={() => handleNavigation('/FiatManagement/WithdrawForm')}>
                      <FaCircleArrowDown className={styles.icon2}/>
                        <span className={styles.text2}>Withdraw</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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