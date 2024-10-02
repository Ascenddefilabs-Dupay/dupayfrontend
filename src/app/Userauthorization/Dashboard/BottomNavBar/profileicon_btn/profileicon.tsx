"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    AppBar, Toolbar, Button, Container, Card, CardContent, Fab, IconButton, Typography, Box
} from '@mui/material';
import { AccountBalanceWallet, Settings, SwapHoriz, ContentCopy } from '@mui/icons-material';
import { FaCheck, FaPlus, FaArrowDown, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCopy, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'next/navigation';
import styles from './profileicon.module.css';
import QrScanner from 'react-qr-scanner';

interface UserProfileProps {
    profileImage: string | null;
    // user_id: string;

}

const UserProfile: React.FC<UserProfileProps> = ({ profileImage }) => {
    return profileImage ? (
        <img src={profileImage} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', marginRight: '5px', marginTop: '8px', border: '2px solid white' }} />
    ) : (
        <FaUserCircle style={{ fontSize: '30px', marginRight: '5px', marginTop: '8px' }} />
    );
};

const Profileicon: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [selectedButton, setSelectedButton] = useState<string>('');
    const [navValue, setNavValue] = useState<number>(0);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [scannerOpen, setScannerOpen] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const userId = 'DupC0001';
    // const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
        // if (sessionDataString) {
        //   const sessionData = JSON.parse(sessionDataString);
        //   const storedUserId = sessionData.user_id;
        //   setUserId(storedUserId);
        //   console.log(storedUserId);
        //   console.log(sessionData.user_email);
        // } else {
        //   redirect('http://localhost:3000/Userauthentication/SignIn');
        // }
        }
    }, []);

    useEffect(() => {
        fetchUserProfile();
    }, []);

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
        setDropdownVisible(prevState => !prevState);
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
    
        return () => clearTimeout(timer);
      }, []);


    const handleCopyEmail = () => {
        navigator.clipboard.writeText(userId);
        console.log('userId copied to clipboard');
    };

    const handleSettings = () => {
        router.push('');
        console.log('Settings button clicked');
    };

    const handleNavigation = (route: string) => {
        setLoading(true); 
        setTimeout(() => {
          router.push(route); 
          setLoading(true);
        }, 2000);
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
  

          return (
            <div className={styles.container}>
              {loading ? (
                <div className={styles.loaderContainer}>
                  <div className={styles.loader}></div>
                </div>
              ) : (
                <>
                  <div className={styles.emailBar}>
                    <div className={styles.walletAddress} onClick={toggleDropdown}>
                      <UserProfile profileImage={profileImage} />
                      <Typography variant="body1" style={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {userId}
                      </Typography>
                      <FaChevronDown className={styles.dropdownIcon} />
                    </div>
                    <div className={styles.iconGroup}>
                      <FontAwesomeIcon icon={faCopy} onClick={handleCopyEmail} />
                      <FontAwesomeIcon icon={faQrcode} onClick={handleQrscanner} style={{ cursor: 'pointer' }} />
                      <FontAwesomeIcon icon={faGear} onClick={() => handleNavigation('/Userauthorization/Dashboard/Settings')} />
                    </div>
                  </div>
        
                  {/* Uncomment the dropdown section if needed */}
                  {/* {dropdownVisible && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownContent}>
                        <div className={styles.dropdownHeader}>Wallets</div>
                        <hr />
                        <div className={styles.dropdownItem}>
                          <UserProfile profileImage={profileImage} />
                          <div className={styles.textContainer}>
                            <div className={styles.userid}>
                              <Typography variant="body1" style={{ color: '#ffffff' }}>
                                {userId}
                              </Typography>
                            </div>
                          </div>
                          <FaCheck className={styles.checkIcon} />
                        </div>
                        <Button className={styles.viewprofileButton} onClick={() => { handleCloseDropdown(); router.push('/UserProfile'); }}>
                          View profile
                        </Button>
                        <Button className={styles.manageWalletsButton} onClick={() => { handleCloseDropdown(); router.push('/Userauthorization/Dashboard/addmanagewallets_btn'); }}>
                          Add & manage wallets
                          <FontAwesomeIcon icon={faGear} />
                        </Button>
                      </div>
                    </div>
                  )} */}
        
                  {/* <AppBar position="static" className={styles.appBar}>
                    <Toolbar className={styles.toolbar}>
                      {!scannerOpen && (
                        <div className={styles.buttonGroup}>
                          <div className={styles.buttonContainer}>
                            <div className={styles.circularButton} onClick={() => handleNavigation('/UserProfile')}>
                              <FaPlus className={styles.icon} />
                            </div>
                            <Typography variant="caption">View profile</Typography>
                          </div>
                          <div className={styles.buttonContainer}>
                            <div className={styles.circularButton} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn')}>
                              <FaArrowDown className={styles.icon} />
                            </div>
                            <Typography variant="caption">manage wallets</Typography>
                          </div>
                        </div>
                      )}
                    </Toolbar>
                  </AppBar> */}

                  <AppBar position="static" className={styles.appBar}>
                  <img
                className={styles.img}
                src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727075702/crypto_image_logo_bxom6g.png"
                alt="transactions_image"
              />
                    <Toolbar className={styles.toolbar}>
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
                    </Toolbar>
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
                </>
              )}
            </div>
          );
        };
        
        export default Profileicon;
