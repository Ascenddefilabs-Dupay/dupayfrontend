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
// Dynamic imports
const Headerbar = dynamic(() => import('./Headernavbar/headernavbar'), {
  loading: () => <div>Loading Header...</div>,
});
const FaUserCircle = dynamic(() => import('react-icons/fa').then((mod) => mod.FaUserCircle));

const GoCheck = dynamic(() => import('react-icons/go').then((mod) => mod.GoCheck));
const IoCashOutline = dynamic(() => import('react-icons/io5').then((mod) => mod.IoCashOutline));
const FaArrowUpLong = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaArrowUpLong));
const FaArrowDownLong = dynamic(() => import('react-icons/fa6').then((mod) => mod.FaArrowDownLong));
const RiBankLine = dynamic(() => import('react-icons/ri').then((mod) => mod.RiBankLine));
const PiHandDepositBold = dynamic(() => import('react-icons/pi').then((mod) => mod.PiHandDepositBold));
const PiHandWithdrawBold = dynamic(() => import('react-icons/pi').then((mod) => mod.PiHandWithdrawBold));
const IoMdSend = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdSend));
const IoMdWallet = dynamic(() => import('react-icons/io').then((mod) => mod.IoMdWallet));
const IoWallet = dynamic(() => import('react-icons/io5').then((mod) => mod.IoWallet));


const Home = () => {
  const [activeTab, setActiveTab] = useState('Crypto');
  const [activeAction, setActiveAction] = useState('');
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
  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // const storedUserId = localStorage.getItem('user_id');
      // setUserId(storedUserId);
      // setAlertMessage('User Need To Login')
      // if (storedUserId === null) redirect('http://localhost:3000/');
      // console.log(storedUserId)
      // console.log(userId)
    }
  }, []);

  const handleTabClick = async (tab: string) => {
    if (tab === 'Fiat') {
      // Check if the fiatWalletId is empty
      if (!fiatWalletId) {
        // Show registration alert first
        const result = await Swal.fire({
          title: 'You are not registered in Fiat',
          text: 'Would you like to register?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, register',
          cancelButtonText: 'No, thanks'
        });
  
        if (result.isConfirmed) {
          // Redirect to the fiat creation page if the user clicks "Yes, register"
          setLoading(true); // Show loading text
          setTimeout(() => {
            router.push('/FiatManagement/FiatWalletAccount/');
            setLoading(false); 
          }, 2000); 
        } else {
          // Ensure the Fiat dropdown remains visible if the user cancels registration
          setFiatDropdownVisible(true);
        }
      } else {
        // If fiatWalletId exists, show the dropdown
        setFiatDropdownVisible(true);
      }
    } else {
      // Close Fiat dropdown when switching to other tabs
      setFiatDropdownVisible(false);
    }
  
    setActiveTab(tab);
    setIsFiatTabSelected(tab === 'Fiat');
  };
  
  
  // Function to handle dropdown toggle manually
  const toggleFiatDropdown = () => {
    setFiatDropdownVisible(!fiatDropdownVisible);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
        // setShowForm(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);
  // Ensure the dropdown remains visible even if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
      if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target as Node)) {
        // Allow manual toggle to close Fiat dropdown
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
      setLoading(true); // Show loading text
      setTimeout(() => {
        router.push(route);
        setLoading(false);
      }, 2000);
    };
    
    const routes: { [key: string]: string }  = {
      'Add Bank': '/FiatManagement/AddBanks',
      'Deposit': '/FiatManagement/DepositForm',
      'Withdraw': '/FiatManagement/WithdrawForm',
      'Send': '/TransactionType/WalletTransactionInterface',
      'Top-up': '/FiatManagement/WithdrawForm',
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
          const response = await axios.get(`http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/fiat_wallets_fetch/${userId}/`);
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
  
  const handleManageprofileWallets = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn'); // Adjust the route as needed
  };

  const handleUserProfileWallet = () => {
    router.push('/UserProfile'); // Adjust the route as needed
  };

  const handleNavigation = (route: string) => {
    setLoading(true); // Show loading text
    setTimeout(() => {
      router.push(route); // Navigate to the dynamic route
      setLoading(false);
    }, 2000);
  };



  const handlebuyclick = () => {
    setLoading(true); // Show loading text
    
    setTimeout(() => {
      if (userId !== fetchedUserId) {
        // Route to cryptowallet if IDs do not match
        router.push('/Userauthorization/Dashboard/cryptowallet');
      } else {
        // Route to DepositForm if IDs match
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
        <div className={styles.leftSection} onClick={toggleDropdown}>
          <div className={styles.walletAddress} onClick={toggleDropdown}>
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
                      <div>{fiatWalletBalance || '₹0.00'}</div>
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
            <button className={styles.walletButton} onClick={() => handleButtonClick('Deposit')}>
              <PiHandDepositBold className={styles.icon} />
              <div className={styles.buttonLabel}>Deposit</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Withdraw')}>
              <PiHandWithdrawBold className={styles.icon} />
              <div className={styles.buttonLabel}>Withdraw</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Send')}>
              <IoMdSend className={styles.icon} />
              <div className={styles.buttonLabel}>Send</div>
            </button>
            <button className={styles.walletButton} onClick={() => handleButtonClick('Top-up')}>
              <IoMdWallet className={styles.icon} />
              <div className={styles.buttonLabel}>Top-up</div>
            </button>
          </div>
        ) : (
          <>
            {[ 'Buy', 'Swap', 'Send', 'Receive', 'Cashout'].map(action => (
              <button
                key={action}
                className={`${styles.actionButton} ${activeAction === action ? styles.activeAction : ''}`}
                onClick={() => {
                  setActiveAction(action);
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

      <div className={styles.tabs}>
        {['Crypto', 'Fiat', 'NFTs'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? styles.activeTab : styles.tab}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.content}>
        {activeTab === 'Crypto' && (
          <div className={styles.cryptoContent}>
            <div className={styles.cryptoIcons}>
              <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911011/crypto_bwvuwf.png" alt="Crypto Icon 1" className={styles.cryptoIcon} />
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
            <div className={styles.dropdownContent}>
              <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
                <div style={{display: 'flex'}}>
                    <div>
                    Fiat Wallet
                    </div>
                    <div style={{ position: 'relative', left: '180px'}}>
                    <button onClick={() => handleNavigation('/FiatManagement/MyWallet')}>
                    <IoWallet style={{ fontSize: '23px' }} />
                  </button>

                    </div>
                </div>
                <hr style={{ color: 'gray' }} />
                <h4 style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold', textAlign: 'left', marginBottom: '15px' }}>
                  Fiat Account
                </h4>
              </div>
              <div className={styles.dropdownItem}>
                {profileImage ? (
                  <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
                ) : (
                  <FaUserCircle className={styles.profileIcon2} />
                )}
                <div className={styles.textContainer}>
                  <div className={styles.userid}>
                  <Typography variant="h6" style={{ marginTop: '1rem' }}>
                      {userId === fetchedUserId ? (
                          fiatWalletId ? (
                              <>
                                  <div>{fiatWalletId}</div>
                                  <div>{fiatWalletBalance}</div>
                              </>
                          ) : (
                              'Loading Fiat Wallet details...'
                          )
                      ) : (
                          'Loading Fiat Wallet details...'
                      )}
                  </Typography>
                 
                  </div>
                  <div>
                      <span style={{ marginLeft: '8px' }}>
                        {userId === fetchedUserId ? '' : '₹0.00'}
                      </span>
                      <div className={styles.icons}>
                        <GoCheck className={styles.checkIcon} />
                      </div>
                  </div>
                  <button className={styles.viewprofileButton} onClick={() => handleNavigation('/UserProfile')}>
                    <span className={styles.text}>View your profile</span>
                  </button>
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
            <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
              Wallets
              <hr style={{ color: 'gray'}} />
              <h4 style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold', textAlign: 'left', marginBottom: '15px' }}>
                Wallet 1
              </h4>
            </div>
            <div className={styles.dropdownItem}>
              {profileImage ? (
                <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
              ) : (
                <FaUserCircle className={styles.profileIcon2} />
              )}
              <div className={styles.textContainer}>
                <div className={styles.userid}>
                  <Typography variant="body1" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px' }}>
                    {userId}
                  </Typography>
                </div>
                <div>
                  <span style={{ marginLeft: '8px'}}>$0.00</span>
                  <div className={styles.icons}>
                    <GoCheck className={styles.checkIcon} />
                  </div>
                </div>
                <button className={styles.viewprofileButton} onClick={() => handleNavigation('/UserProfile')}>
                  <span className={styles.text}>View your profile</span>
                </button>

              </div>
            </div>
            <button className={styles.manageWalletsButton} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')}>
              <span className={styles.text}>Add & manage wallets</span>
              <FontAwesomeIcon icon={faCog} className={styles.settingsIcon} />
            </button>
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