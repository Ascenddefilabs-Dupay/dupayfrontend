"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    AppBar, Toolbar, Button, Container, Card, CardContent, Fab, IconButton, Typography
} from '@mui/material';
import { AccountBalanceWallet, Settings, SwapHoriz, ContentCopy } from '@mui/icons-material';
import { FaCheck, FaPlus, FaQrcode, FaArrowDown, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCopy } from '@fortawesome/free-solid-svg-icons';
import QrScanner from 'react-qr-scanner';
import styles from './profileicon.module.css';
import { Box } from '@mui/material';
import Draggable, { DraggableCore } from 'react-draggable';
import { styled } from '@mui/system';

const UserProfile = ({ profileImage }) => {
    return profileImage ? (
        <img src={profileImage} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover', marginRight: '5px', marginTop: '8px', border: '2px solid white' }} />
    ) : (
        <FaUserCircle style={{ fontSize: '30px', marginRight: '5px', marginTop: '8px' }} />
    );
};

export default function Profileicon() {
    const [selectedButton, setSelectedButton] = useState('');
    const [navValue, setNavValue] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [qrData, setQrData] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const router = useRouter();
    const userId = 'DupC0001';


    const UserProfile = ({ profileImage, className }) => {
        return profileImage ? (
            <img
                src={profileImage}
                alt="Profile"
                className={className}
                
            />
        ) : (
            <FaUserCircle
                className={className}
            />
        );
    };
    

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`/userauthorizationapi/profile/${userId}/`);
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

    const handleTopButtonClick = (button) => {
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
    

    const handleNavChange = (event, newValue) => {
        setNavValue(newValue);
        router.push('/Userauthorization/Dashboard');
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(userId);
        console.log('userId copied to clipboard');
    };

    const handleSettings = () => {
        router.push('/Userauthorization/Dashboard/Settings');
        console.log('Settings button is clicked');
    };

    const handleCloseDropdown = () => {
        setDropdownVisible(false);
    };

    const handleQrClick = () => {
        setScannerOpen(true);
    };

    const handleCloseScanner = () => {
        setScannerOpen(false);
    };

    const handleScan = (data) => {
        if (data) {
            setQrData(data);
            console.log('QR Code Data:', data);
            handleCloseScanner();
        }
    };

    const handleError = (error) => {
        console.error('QR Scanner Error:', error);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.emailBar}>
                    <div className={styles.walletAddress} onClick={toggleDropdown}>
                        <UserProfile profileImage={profileImage} className = {styles.profileIcon}/>
                        <Typography variant="body1" style={{ color: '#ffffff' , fontWeight: 'bold'}}>
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
                                <UserProfile profileImage={profileImage} className = {styles.profileIcon2}/>
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

                {scannerOpen && (
                    <div className={styles.qrOverlay}>
                        <QrScanner
                            onScan={handleScan}
                            onError={handleError}
                            style={{ width: '100%', height: '100%' }}
                        />
                        <button className={styles.closeQrButton} onClick={handleCloseScanner}>
                            Close
                        </button>
                    </div>
                )}

                <AppBar position="static" className={styles.appBar}>
                    <Toolbar className={styles.toolbar}>
                        <Typography variant="h5">₹0.00</Typography>

                        {!scannerOpen && (
                            <div className={styles.buttonGroup}>
                                <div className={styles.buttonContainer}>
                                    <Fab size="small" color="primary" onClick={() => handleTopButtonClick('Buy')}  sx={{ background: 'linear-gradient(90deg, #007bff9f, #800080)', color: 'white' }}>
                                        <FaPlus fontSize="18px" color="white" />
                                    </Fab>
                                    <Typography variant="caption">Buy</Typography>
                                </div>
                                <div className={styles.buttonContainer}>
                                    <Fab size="small" color="primary" onClick={() => handleTopButtonClick('Receive')}  sx={{ background: 'linear-gradient(90deg, #007bff9f, #800080)', color: 'white' }}>
                                        <FaArrowDown fontSize="20px" color="white" />
                                    </Fab>
                                    <Typography variant="caption">Receive</Typography>
                                </div>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>

                <p style={{ fontWeight: 'bold', marginLeft: '20px' }}>New to Dupay Wallet?</p>
                <p style={{ fontSize: '12px', marginLeft: '20px', color: 'gray' }}>Here's how to get started.</p>

                <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center', flex: 1, marginBottom: '200px' }}>
                    <Card className={styles.card}>
                        <CardContent>
                            <div className={styles.imgdiv}>
                                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/Buycrypto-btn.image_lwpfle.png" alt="Buycrypto-btn_imaage.jpg" className={styles.image} />
                                <div className={styles.getstartbtn}>
                                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>Fund your wallet</Typography>
                                    <p style={{ fontSize: '11px' }}>Get a free NFT by adding</p>
                                    <p style={{ fontSize: '11px' }}>ETH or USDC</p>
                                    <Button className={styles.button} onClick={() => handleTopButtonClick('Get started')}>
                                        Get started
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        </>
    );
}
