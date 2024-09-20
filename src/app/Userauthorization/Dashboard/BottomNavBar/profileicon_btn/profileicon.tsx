"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    AppBar, Toolbar, Button, Container, Card, CardContent, Fab, IconButton, Typography, Box
} from '@mui/material';
import { AccountBalanceWallet, Settings, SwapHoriz, ContentCopy } from '@mui/icons-material';
import { FaCheck, FaPlus, FaQrcode, FaArrowDown, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCopy } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'next/navigation';
import Draggable from 'react-draggable';
import { styled } from '@mui/system';
import styles from './profileicon.module.css';

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
    const [selectedButton, setSelectedButton] = useState<string>('');
    const [navValue, setNavValue] = useState<number>(0);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [scannerOpen, setScannerOpen] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>('');
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

    const handleTopButtonClick = (button: string) => {
        if (button === 'Buy') {
            setSelectedButton(button);
            console.log(button);
            router.push('/FiatManagement/Currency_Conversion');
        } else if (button === 'Receive') {
            setSelectedButton(button);
            console.log(button);
            router.push('/Userauthorization/receive_btn');
        } else {
            console.log('Unknown button clicked:', button);
        }
    };

    const handleNavChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setNavValue(newValue);
        router.push('/Userauthorization/Dashboard');
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(userId);
        console.log('userId copied to clipboard');
    };

    const handleSettings = () => {
        router.push('/Userauthorization/Dashboard/Settings');
        console.log('Settings button clicked');
    };

    const handleCloseDropdown = () => {
        setDropdownVisible(false);
    };

    return (
        <>
            <div className={styles.container}>
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
                        <FontAwesomeIcon icon={faGear} onClick={handleSettings} />
                    </div>
                </div>

                {dropdownVisible && (
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
                                    <div>₹0.00</div>
                                </div>
                                <FaCheck className={styles.checkIcon} />
                            </div>
                            <Button className={styles.viewprofileButton} onClick={() => { handleCloseDropdown(); router.push('/UserProfile'); }}>
                                View profile
                            </Button>
                            <Button className={styles.manageWalletsButton} onClick={() => { handleCloseDropdown(); router.push('/Userauthorization/Dashboard/addmanagewallets_btn'); }}>
                                Add & manage wallets
                                <Settings />
                            </Button>
                        </div>
                    </div>
                )}
                <AppBar position="static" className={styles.appBar}>
                    <Toolbar className={styles.toolbar}>
                        <Typography variant="h5">₹0.00</Typography>

                        {!scannerOpen && (
                            <div className={styles.buttonGroup}>
                                <div className={styles.buttonContainer}>
                                    <div className={styles.circularButton} onClick={() => handleTopButtonClick('Buy')}>
                                        <FaPlus className={styles.icon} />
                                    </div>
                                    <Typography variant="caption">Buy</Typography>
                                </div>
                                <div className={styles.buttonContainer}>
                                    {/* <Fab size="small" color="secondary" onClick={() => handleTopButtonClick('Receive')} sx={{ background: 'linear-gradient(90deg, #007bff9f, #800080)', color: 'white' }}>
                                        <FaArrowDown fontSize="20px" color="white" />
                                    </Fab> */}
                                    <div className={styles.circularButton} onClick={() => handleTopButtonClick('Receive')}>
                                        <FaArrowDown className={styles.icon} />
                                    </div>

                                    
                                    <Typography variant="caption">Receive</Typography>
                                </div>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>

                <p style={{ fontWeight: 'bold', marginLeft: '20px' }}>New to Dupay Wallet?</p>
                <p style={{ fontSize: '12px', marginLeft: '20px', color: 'gray' }}>Here is how to get started.</p>

                <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', flex: 1, marginBottom: '200px' }}>
                    <Card className={styles.card}>
                        <CardContent>
                            <div className={styles.imgdiv}>
                                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/Buycrypto-btn.image_lwpfle.png" alt="Buycrypto-btn_image" className={styles.image} />
                                <div className={styles.getstartbtn}>
                                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>Fund your wallet</Typography>
                                    <p style={{ fontSize: '11px' }}>Get a free NFT by adding</p>
                                    <p style={{ fontSize: '11px' }}>ETH or USDC</p>
                                    <Button className={styles.button} onClick={() => router.push('/Userauthorization/Dashboard/NFT')}>Get started</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                </Container>
            </div>
        </>
    );
};

export default Profileicon;
