// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faExchangeAlt, faSyncAlt, faPaperPlane, faDownload, faWallet, faListAlt, faCog, faChevronDown } from '@fortawesome/free-solid-svg-icons';
// import styles from './Home.module.css';
// import { FaUserCircle } from 'react-icons/fa';
// import { styled } from '@mui/material/styles';
// import axios from 'axios';
// import Typography from '@mui/material/Typography';
// import { GoCheck } from "react-icons/go";
// import Headerbar from './Headernavbar/headernavbar';
// import { IoCashOutline } from "react-icons/io5";
// import { FaArrowUpLong } from "react-icons/fa6";
// import { FaArrowDownLong } from "react-icons/fa6";
// import { RiBankLine } from "react-icons/ri";
// import { PiHandDepositBold } from "react-icons/pi";
// import { PiHandWithdrawBold } from "react-icons/pi";
// import { IoMdSend } from "react-icons/io";
// import { IoMdWallet } from "react-icons/io";

// const Home = () => {
//   const [activeTab, setActiveTab] = useState('Crypto');
//   const [activeAction, setActiveAction] = useState('');
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [fiatDropdownVisible, setFiatDropdownVisible] = useState(false);
//   const [profileImage, setProfileImage] = useState('');
//   const userId = 'dupC0025';
//   const router = useRouter();
//   const dropdownRef = useRef(null); // Ref for dropdown container
//   const fiatDropdownRef = useRef(null); // Ref for fiat dropdown container

//   const [isFiatTabSelected, setIsFiatTabSelected] = useState(false);

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//     setIsFiatTabSelected(tab === 'Fiat');
//   };


//   const handleButtonClick = (buttonName) => {
//     switch (buttonName) {
//       case 'Add Bank':
//         router.push('/Userauthorization/Dashboard/fiatwallet/addbank_btn');
//         break;
//       case 'Deposit':
//         router.push('/Userauthorization/Dashboard/fiatwallet/deposit_btn');
//         break;
//       case 'Withdraw':
//         router.push('/Userauthorization/Dashboard/fiatwallet/withdraw_btn');
//         break;
//       case 'Send':
//         router.push('/Userauthorization/Dashboard/fiatwallet/send_btn');
//         break;
//       case 'Top-up':
//         router.push('/Userauthorization/Dashboard/fiatwallet/top-up_btn');
//         break;
//       default:
//         console.log('No route defined for this button');
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
//       if (response.data.user_profile_photo) {
//         const baseURL = 'http://localhost:8000/profile_photos';
//         let imageUrl = '';

//         if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
//           imageUrl = response.data.user_profile_photo;
//         } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
//           imageUrl = `${baseURL}${response.data.user_profile_photo}`;
//         } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
//           const byteArray = new Uint8Array(response.data.user_profile_photo.data);
//           const base64String = btoa(
//             byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
//           );
//           imageUrl = `data:image/jpeg;base64,${base64String}`;
//         }

//         setProfileImage(imageUrl);
//       }
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleIconClick = (iconName) => {
//     switch (iconName) {
//       case 'Buy':
//         router.push('/Userauthorization/Dashboard/buy_btn');
//         break;
//       case 'Swap':
//         router.push('/Userauthorization/swap_btn');
//         break;
//       case 'Cashout':
//         router.push('/Userauthorization/cashout_btn');
//         break;
//       case 'Send':
//         router.push('/Userauthorization/send_btn');
//         break;
//       case 'Receive':
//         router.push('/Userauthorization/receive_btn');
//         break;
//       case 'Fiat':
//         setFiatDropdownVisible(true);
//         break;
//       default:
//         break;
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownVisible(false);
//       }
//       if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target)) {
//         setFiatDropdownVisible(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [dropdownVisible, fiatDropdownVisible]);

//   const handleAddCryptoClick = () => {
//     handleIconClick('Add crypto');
//     router.push('/Userauthorization/Dashboard/addcrypto_btn'); // Ensure the correct path here
//   };

//   const handleManageWallets = () => {
//     router.push('/Userauthorization/Dashboard/addmanagewallets_btn'); // Adjust the route as needed
//   };

//   const handlebuyclick = () => {
//     router.push('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn')
//   };

//   const handlefiatuserid = () => {
//     router.push('/Userauthorization/Dashboard/fiatwallet')
//   }

//   const handleCopyUserId = () => {
//     navigator.clipboard.writeText(userId);
//   };

//   const ProfileImage = styled('img')({
//     width: '35px',
//     height: '35px',
//     borderRadius: '50%',
//     objectFit: 'cover',
//     marginRight: '5px',
//     border: '2px solid white',
//   });

//   return (
//     <div className={styles.container}>
//       <header>
//         {/* Header content here */}
//       </header>
//       <div className={styles.header}>
//         <div className={styles.leftSection} onClick={toggleDropdown}>
//           <div className={styles.walletAddress} onClick={toggleDropdown}>
//             {profileImage ? (
//               <ProfileImage src={profileImage} alt="Profile Image" />
//             ) : (
//               <FaUserCircle className={styles.profileIcon} />
//             )}
//             <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px' }}>
//               {userId}
//             </Typography>
//             <FontAwesomeIcon icon={faChevronDown} className={styles.dropdownIcon} />
//           </div>
//         </div>
//         <div className={styles.rightSection}>
//           <header className={styles.righttopicons}>
//             <Headerbar userId={userId} onCopyUserId={handleCopyUserId} />
//           </header>
//         </div>
//       </div>
//       <div className={styles.balance}>
//         <button onClick={handlebuyclick}>
//           ₹0.00
//         </button>
//       </div>
      
//       <div className={styles.actions}>
//         {isFiatTabSelected ? (
//           <div className={styles.buttonContainer}>
//             <button className={styles.walletButton} onClick={() => handleButtonClick('Add Bank')}>
//               <RiBankLine className={styles.icon} />
//               <div className={styles.buttonLabel}>Add Bank</div>
//             </button>
//             <button className={styles.walletButton} onClick={() => handleButtonClick('Deposit')}>
//               <PiHandDepositBold className={styles.icon} />
//               <div className={styles.buttonLabel}>Deposit</div>
//             </button>
//             <button className={styles.walletButton} onClick={() => handleButtonClick('Withdraw')}>
//               <PiHandWithdrawBold className={styles.icon} />
//               <div className={styles.buttonLabel}>Withdraw</div>
//             </button>
//             <button className={styles.walletButton} onClick={() => handleButtonClick('Send')}>
//               <IoMdSend className={styles.icon} />
//               <div className={styles.buttonLabel}>Send</div>
//             </button>
//             <button className={styles.walletButton} onClick={() => handleButtonClick('Top-up')}>
//               <IoMdWallet className={styles.icon} />
//               <div className={styles.buttonLabel}>Top-up</div>
//             </button>
//           </div>
//         ) : (
//           <>
//             {[ 'Buy', 'Swap', 'Send', 'Receive', 'Cashout'].map(action => (
//               <button
//                 key={action}
//                 className={`${styles.actionButton} ${activeAction === action ? styles.activeAction : ''}`}
//                 onClick={() => {
//                   setActiveAction(action);
//                   handleIconClick(action);
//                 }}
//               >
//                 {getIcon(action)}
//                 <span>{action}</span>
//               </button>
//             ))}
//           </>
//         )}
//       </div>

//       <div className={styles.tabs}>
//         {['Crypto', 'Fiat', 'NFTs'].map(tab => (
//           <button
//             key={tab}
//             className={activeTab === tab ? styles.activeTab : styles.tab}
//             onClick={() => handleTabClick(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//       <div className={styles.content}>
//         {activeTab === 'Crypto' && (
//           <div className={styles.cryptoContent}>
//             <div className={styles.cryptoIcons}>
//               <img src="/crypto.png" alt="Crypto Icon 1" className={styles.cryptoIcon} />
//             </div>
//             <div className={'button-container'}>
//               <h2 className={styles.addNameStart}>Add crypto to get started</h2>
//               <button className={styles.addCryptoButton} onClick={handleAddCryptoClick}>
//                 Add crypto
//               </button>
//             </div>
//           </div>
//         )}
//         {activeTab === 'Fiat' && <div> 
//           </div>}
//         {activeTab === 'NFTs' && <div>NFTs Content</div>}
//       </div>
//       {dropdownVisible && (
//         <div ref={dropdownRef} className={styles.dropdown}>
//           <div className={styles.dropdownContent}>
//             <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
//               Wallets
//               <hr style={{ color: 'gray'}} />
//               <h4 style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold', textAlign: 'left', marginBottom: '15px' }}>
//                 Wallet 1
//               </h4>
//             </div>
//             <div className={styles.dropdownItem}>
//               {profileImage ? (
//                 <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
//               ) : (
//                 <FaUserCircle className={styles.profileIcon2} />
//               )}
//               <div className={styles.textContainer}>
//                 <div className={styles.userid}>
//                   <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px' }}>
//                     {userId}
//                   </Typography>
//                 </div>
//                 <div>
//                   <span style={{ marginLeft: '8px'}}>$0.00</span>
//                   <div className={styles.icons}>
//                     <GoCheck className={styles.checkIcon} />
//                   </div>
//                 </div>
//                 <button className={styles.viewprofileButton} onClick={handleManageWallets}>
//                   <span className={styles.text}>View your profile</span>
//                 </button>
//               </div>
//             </div>
//             <button className={styles.manageWalletsButton} onClick={handleManageWallets}>
//               <span className={styles.text}>Add & manage wallets</span>
//               <FontAwesomeIcon icon={faCog} className={styles.settingsIcon} />
//             </button>
//           </div>
//         </div>
//       )}
//       {fiatDropdownVisible && (
//         <div ref={fiatDropdownRef} className={styles.fiatDropdown}>
//           <div className={styles.dropdownContent}>
//             <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
//               Fiat Wallet
//               <hr style={{ color: 'gray' }} />
//               <h4 style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold', textAlign: 'left', marginBottom: '15px' }}>
//                 Fiat Account
//               </h4>
//             </div>
//             <div className={styles.dropdownItem}>
//               {profileImage ? (
//                 <ProfileImage src={profileImage} alt="Profile Image" className={styles.profileImagesrc} />
//               ) : (
//                 <FaUserCircle className={styles.profileIcon2} />
//               )}
//               <div className={styles.textContainer}>
//                 <div className={styles.userid}>
//                   <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px' }}>
//                     {/* {userId} */}
//                     <button onClick={handlefiatuserid}>
//                       fiatC0001
//                     </button>
//                   </Typography>
//                 </div>
//                 <div>
//                   <span style={{ marginLeft: '8px' }}>$0.00</span>
//                   <div className={styles.icons}>
//                     <GoCheck className={styles.checkIcon} />
//                   </div>
//                 </div>
//                 <button className={styles.viewprofileButton} onClick={handleManageWallets}>
//                   <span className={styles.text}>View your profile</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const getIcon = (action) => {
//   switch (action) {
//     case 'Buy':
//       return <FontAwesomeIcon icon={faPlus} />;
//     case 'Swap':
//       return <FontAwesomeIcon icon={faExchangeAlt} />;
//     case 'Cashout':
//       return <IoCashOutline style={{fontSize: '30px'}} />;
//     case 'Send':
//       return <FaArrowUpLong />;
//     case 'Receive':
//       return <FaArrowDownLong />;
//     case 'Assets':
//       return <FontAwesomeIcon icon={faWallet} />;
//     case 'Transactions':
//       return <FontAwesomeIcon icon={faListAlt} />;
//     case 'Settings':
//       return <FontAwesomeIcon icon={faCog} />;
//     default:
//       return null;
//   }
// };

// export default Home;

"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faExchangeAlt, faSyncAlt, faPaperPlane, faDownload, faWallet, faListAlt, faCog, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Home.module.css';
import { FaUserCircle } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { GoCheck } from "react-icons/go";
import Headerbar from './Headernavbar/headernavbar';
import { IoCashOutline } from "react-icons/io5";
import { FaArrowUpLong } from "react-icons/fa6";
import { FaArrowDownLong } from "react-icons/fa6";
import { RiBankLine } from "react-icons/ri";
import { PiHandDepositBold } from "react-icons/pi";
import { PiHandWithdrawBold } from "react-icons/pi";
import { IoMdSend } from "react-icons/io";
import { IoMdWallet } from "react-icons/io";

const Home = () => {
  const [activeTab, setActiveTab] = useState('Crypto');
  const [activeAction, setActiveAction] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fiatDropdownVisible, setFiatDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const userId = 'dupC0025';
  const router = useRouter();
  const dropdownRef = useRef(null); // Ref for dropdown container
  const fiatDropdownRef = useRef(null); // Ref for fiat dropdown container

  const [isFiatTabSelected, setIsFiatTabSelected] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsFiatTabSelected(tab === 'Fiat');
    setFiatDropdownVisible(true); // Hide Fiat dropdown when switching tabs
    
  };

  const handleButtonClick = (buttonName) => {
    switch (buttonName) {
      case 'Add Bank':
        // router.push('/Userauthorization/Dashboard/fiatwallet/addbank_btn');
        window.location.href = '/FiatManagement/AddBanks';
        break;
      case 'Deposit':
        // router.push('/Userauthorization/Dashboard/fiatwallet/deposit_btn');
        window.location.href = '/FiatManagement/DepositForm';
        break;
      case 'Withdraw':
        // router.push('/Userauthorization/Dashboard/fiatwallet/withdraw_btn');
        window.location.href = '/FiatManagement/WithdrawForm';
        break;
      case 'Send':
        // router.push('/Userauthorization/Dashboard/fiatwallet/send_btn');
        window.location.href = '/TransactionType/WalletTransactionInterface';
        break;
      case 'Top-up':
        router.push('/FiatManagement/top-up_btn');
        break;
      default:
        console.log('No route defined for this button');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
      if (response.data.user_profile_photo) {
        const baseURL = 'http://localhost:8000/profile_photos';
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

  const handleIconClick = (iconName) => {
    if (iconName === 'Fiat') {
      setFiatDropdownVisible(!fiatDropdownVisible);
    } else {
      switch (iconName) {
        case 'Buy':
          // router.push('/Userauthorization/Dashboard/buy_btn');
          window.location.href = '/FiatManagement/Currency_Conversion';
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
    const handleClickOutside = (event) => {
      if (dropdownVisible && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target)) {
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
    router.push('/Manageprofile'); // Adjust the route as needed
  };

  const handleManageWallets = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn'); // Adjust the route as needed
  };
  const handleViewWallets = () => {
    router.push('/Manageprofile/UserProfile/Manageprofile'); // Adjust the route as needed
    // window.location.href = 'http://localhost:3004/Manageprofile';
  };

  const handlebuyclick = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn')
  };

  const handlefiatuserid = () => {
    // router.push('/Userauthorization/Dashboard/fiatwallet')
  }

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
            <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px' }}>
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
        <button onClick={handlebuyclick}>
          ₹0.00
        </button>
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
              <img src="/crypto.png" alt="Crypto Icon 1" className={styles.cryptoIcon} />
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
                Fiat Wallet
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
                    <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px' }}>
                      <button onClick={handlefiatuserid}>
                        fiatC0001
                      </button>
                    </Typography>
                  </div>
                  <div>
                    <span style={{ marginLeft: '8px' }}>$0.00</span>
                    <div className={styles.icons}>
                      <GoCheck className={styles.checkIcon} />
                    </div>
                  </div>
                  <button className={styles.viewprofileButton} onClick={handleViewWallets}>
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
                  <Typography variant="h9" style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '15px', marginLeft: '8px' }}>
                    {userId}
                  </Typography>
                </div>
                <div>
                  <span style={{ marginLeft: '8px'}}>$0.00</span>
                  <div className={styles.icons}>
                    <GoCheck className={styles.checkIcon} />
                  </div>
                </div>
                <button className={styles.viewprofileButton} onClick={handleManageWallets}>
                  <span className={styles.text}>View your profile</span>
                </button>
              </div>
            </div>
            <button className={styles.manageWalletsButton} onClick={handleManageprofileWallets}>
              <span className={styles.text}>Add & manage wallets</span>
              <FontAwesomeIcon icon={faCog} className={styles.settingsIcon} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const getIcon = (action) => {
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
