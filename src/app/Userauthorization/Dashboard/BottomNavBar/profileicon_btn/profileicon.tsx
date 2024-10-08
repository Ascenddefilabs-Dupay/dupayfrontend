"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    AppBar, Toolbar, Typography,
} from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCopy, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'next/navigation';
import styles from './profileicon.module.css';
import QrScanner from 'react-qr-scanner';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface UserProfileData {
  user_id: string;
  user_profile_photo?: string | { data: number[] };
}


const Profileicon: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [selectedButton, setSelectedButton] = useState<string>('');
    const [navValue, setNavValue] = useState<number>(0);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [scannerOpen, setScannerOpen] = useState<boolean>(false);
    const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });
    const [loading, setLoading] = useState(false);
    const [userFirstName, setUserFirstName] = useState(''); // For storing user first name
    const [isDupayOpen, setIsDupayOpen] = useState(false);
    const router = useRouter();
    const [profileImage, setProfileImage] = useState('');
    // const userId = 'DupC0001';
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
        if (sessionDataString) {
          const sessionData = JSON.parse(sessionDataString);
          const storedUserId = sessionData.user_id;
          setUserId(storedUserId);
          console.log(storedUserId);
          console.log(sessionData.user_email);
        } else {
          // redirect('http://localhost:3000/Userauthentication/SignIn');
        }
        }
    }, []);

    useEffect(() => {
      fetchUserProfile();
    }, [userId]); 

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://userauthorization-ind-255574993735.asia-south1.run.app/userauthorizationapi/profile/${userId}/`);
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
  

    const toggleDropdown = () => {
        setDropdownVisible(prevState => !prevState);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
    
        return () => clearTimeout(timer);
      }, []);



    const handleSettings = () => {
        router.push('');
        console.log('Settings button clicked');
    };

    const handleNavigation = (route: string) => {
        setLoading(true); 
        router.push(route); 
        // setTimeout(() => {
        //   // setLoading(true);
        // }, 2000);
      };

         // Handle what happens after scanning
         const handleScan = (data: any) => {
            if (data) {
              console.log('Scanned data:', data);
              setIsScanning(false); // Close the scanner after successful scan
            }
          };
        
          const handleError = (err: any) => {
            console.error('Error scanning:', err);
          };
        
          const handleQrscanner = () => {
            setIsScanning(!isScanning);
          };
  
          const handleDupayClick = () => {
            setIsDupayOpen(true); // Open the blur screen with buttons
          };
        
          const handleClose = () => {
            setIsDupayOpen(false); // Close the blur screen
          };
          

          return (
            <div className={styles.container}>
              {loading ? (
                <div className={styles.loaderContainer}>
                  <div className={styles.loader}></div>
                </div>
              ) : (
                <>
                  <div className={styles.emailBar}>
                  <div onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')}>
                      <ArrowBackIcon />
                  </div>
                    <div className={styles.walletAddress} onClick={toggleDropdown}>

                    <div  onClick={() => handleNavigation('/UserProfile')}>
                      <FaUserCircle style={{ fontSize: '30px', marginRight: '4px', position: 'relative', right: '18px' }} />
                  </div>
                      <div className={styles.goodMorningAnuroopContainer}>
                      <span>{`Good morning, `} <b>{userFirstName || 'User'}</b></span>

                      </div>
                    </div>
                    <div className={styles.iconGroup}>
                      <FontAwesomeIcon icon={faCopy}  />
                      <FontAwesomeIcon icon={faQrcode} onClick={handleQrscanner} style={{ cursor: 'pointer' }} />
                      <FontAwesomeIcon icon={faGear} onClick={() => handleNavigation('/Userauthorization/Dashboard/Settings')} />
                    </div>
                  </div>

                  <AppBar position="static" className={styles.appBar}>
                  {/* <img
                className={styles.img}
                src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075702/crypto_image_logo_bxom6g.png"
                alt="transactions_image"
              /> */}

                  {/* <div className={styles.frameParent} onClick={() => handleNavigation('/UserProfile')}>
                  <div className={styles.frameGroup}>
                  <div className={styles.iconavatarParent}>
                  <img className={styles.iconavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381541/avatar_icon_ydlrvf.png" />
                  <div className={styles.dupc001}>View Profile</div>
                  </div>
                  <div className={styles.iconsettingWrapper}>
                  <img className={styles.iconsetting} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381740/Settings_icon_vcznos.svg" />
                  </div>
                  </div>
                  </div>

                  <div className={styles.frameParent} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')} >
                  <div className={styles.frameGroup}>
                  <div className={styles.iconavatarParent}>
                  <img className={styles.iconavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381541/avatar_icon_ydlrvf.png" />
                  <div className={styles.dupc001}>Add & Manage Profile</div>
                  </div>
                  <div className={styles.iconsettingWrapper}>
                  <img className={styles.iconsetting} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381740/Settings_icon_vcznos.svg" />
                  </div>
                  </div>
                  </div> */}





<div className={styles.frameParent} onClick={() => handleNavigation('/UserProfile')}>
  <div className={styles.frameGroup}>
    <div className={styles.iconavatarParent}>
      <img className={styles.iconavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381541/avatar_icon_ydlrvf.png" />
      <div className={styles.dupc001}>View Profile</div>
    </div>
    <div className={styles.iconsettingWrapper}>
      <img className={styles.iconsetting} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381740/Settings_icon_vcznos.svg" />
    </div>
  </div>
</div>

<div className={styles.frameParent} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')}>
  <div className={styles.frameGroup}>
    <div className={styles.iconavatarParent}>
      <img className={styles.iconavatar} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381541/avatar_icon_ydlrvf.png" />
      <div className={styles.dupc001}>Add & Manage Profile</div>
    </div>
    <div className={styles.iconsettingWrapper}>
      <img className={styles.iconsetting} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728381740/Settings_icon_vcznos.svg" />
    </div>
  </div>
</div>

                  
                    {/* <Toolbar className={styles.toolbar}>
                      {!scannerOpen && (
                        <div className={styles.buttonGroup}>
                          <div className={styles.buttonContainer}>
                            <div className={styles.customButton} onClick={() => handleNavigation('/UserProfile')}>
                              View Profile
                            </div>
                          </div>
                          <div className={styles.buttonContainer}>
                            <div className={styles.customButton} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')}>
                              Add & Manage Profile
                            </div>
                          </div>
                        </div>
                      )}
                    </Toolbar> */}
                    
                  </AppBar>

        
                  {/* Full-screen QR Scanner */}
                  {isScanning && (
                    <div className={styles.overlay}>
                      <div className={styles.scannerContainer}>
                        <QrScanner
                          delay={300}
                          onError={handleError}
                          onScan={handleScan}
                          className={styles.scanner}
                        />
                        {/* Central scanning box */}
                        <div className={styles.scanArea}></div>
                      </div>
                      {/* Close button */}
                      <button className={styles.closeButton} onClick={() => setIsScanning(false)}>
                        Close Scanner
                      </button>
                    </div>
                  )}

<div className={styles.homeInner} onClick={handleDupayClick}>
            <img 
              className={styles.frameChild} 
              alt="Dupay Animation" 
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" 
            />
          </div>

          <div className={styles.tabbarstabbars}>
            <div className={styles.div}>
              <div 
                className={styles.content11} 
                onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/transaction_btn')}
              >
                <AssessmentIcon />
                <b className={styles.text}>Transaction</b>
              </div>
            </div>
            <div className={styles.div1} onClick={handleDupayClick}>
              <div className={styles.content11}>
                <img 
                  className={styles.iconbase} 
                  alt="Dupay" 
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" 
                />
                <b className={styles.text}>Dupay</b>
              </div>
            </div>
            <div className={styles.div1}>
              <div 
                className={styles.content11}  
                onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn')}
              >
                <img 
                  className={styles.iconbase} 
                  alt="Profile" 
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" 
                />
                <b className={styles.text}>Profile</b>
              </div>
            </div>
          </div>

          {isDupayOpen && (
              <div className={styles.overlay}>
                <div className={styles.blurBackground}></div>
                <div className={styles.buttonsContainer}>
                  <div className={styles.button}    
                    onClick={() => handleNavigation('/Userauthorization/cashout_btn')}
                    >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085076/cashout_icon_h0h6vj.png" alt="Cashout" 
              style={{position: 'relative', right: '-5px'}}	  />
                    <span>Cashout</span>
                  </div>
                  <div className={styles.button}
                onClick={() => handleNavigation('/Userauthorization/swap_btn')}
                    >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085724/swap_icon_v5uzcz.png" alt="Swap" 
              style={{position: 'relative', right: '3px'}}
              />
              <div style={{ fontFamily: 'Roboto, sans-serif' }}>Swap</div>
            </div>
                  <div className={styles.button}
                  onClick={() => handleNavigation('/Userauthorization/receive_btn')} >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085940/Receive_icon_kwgsaq.png" alt="Receive" 
              style={{width:'20px', height: '20px', position: 'relative', right: '-15px'}}		  />
                    <div style={{ marginLeft: '20px', fontFamily: 'Roboto, sans-serif' }}>Receive</div>
                  </div>
                  <div className={styles.button}
                  onClick={() => handleNavigation('/Userauthorization/send_btn')}>
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085858/Send_icon_zag3am.png" alt="Send" 
              style={{width:'20px', height: '20px', position: 'relative', right: '4px'}}
              />
                    <div style={{ fontFamily: 'Roboto, sans-serif' }}>Send</div>
                  </div>
                  <div className={styles.button}
                onClick={() => handleNavigation('/WalletManagement/Transak')}  >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086014/Buy_icon_rwmfdq.png" alt="Buy" 
              style={{position: 'relative', right: '7px'}}			  />

                    <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', right: '7px'  }}>Buy</div>
                  </div>
                </div>
                {/* Close button */}
                <button className={styles.closeButton1} onClick={handleClose}>
                  <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
                </button>
              </div>
            )}

                </>
              )}
            </div>
          );
        };
        
        export default Profileicon;
