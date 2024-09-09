"use client";

import React, { useState, useEffect, memo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IoMdWallet } from "react-icons/io";
import { IoWallet } from "react-icons/io5";
import Typography from '@mui/material/Typography';
import styles from './wallet.module.css';
import { styled } from '@mui/material/styles';
import { FaUserCircle } from 'react-icons/fa';
import { GoCheck } from 'react-icons/go';

// Styled component for Profile Image
const ProfileImage = styled('img')({
  width: '35px',
  height: '35px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '5px',
  border: '2px solid white',
});

const Wallet: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fiatDropdownVisible, setFiatDropdownVisible] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [fiatWalletId, setFiatWalletId] = useState<string | null>(null);
    const [fiatWalletBalance, setFiatWalletBalance] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch or check session data here
    }, [router]);

    const handleBackClick = () => {
        setLoading(true);
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard');
        }, 500);
    };

    const handleCreateWalletClick = () => {
        router.push('/Userauthorization/wallet/CreateWallet');
    };

    const handleMyWalletClick = () => {
        setFiatDropdownVisible(prev => !prev);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const fiatDropdownRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (fiatDropdownVisible && fiatDropdownRef.current && !fiatDropdownRef.current.contains(event.target as Node)) {
            setFiatDropdownVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [fiatDropdownVisible]);

    return (
        <div>
            <div className={styles.container}>
                {loading ? (
                    <div className={styles.loaderContainer}>
                        <div className={styles.loader}></div>
                    </div>
                ) : (
                    <>
                        <div>
                            <IconButton onClick={handleBackClick} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            Wallet
                        </div>
                        <div className={styles.buttonContainer}>
                            <button className={styles.button} onClick={handleCreateWalletClick}>
                                <div><IoWallet size={24} /></div>
                                <div>Create Wallet</div>
                            </button>
                            <button className={styles.button} onClick={handleMyWalletClick}>
                                <div><IoMdWallet size={24} /></div>
                                <div>My Wallet</div>
                            </button>
                        </div>

                        {/* Fiat Dropdown */}
                        {fiatDropdownVisible && (
                            <div ref={fiatDropdownRef} className={styles.fiatDropdown}>
                                <div className={styles.dropdownContent}>
                                    <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', textAlign: 'left', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex' }}>
                                            <div>Fiat Wallet</div>
                                            <div className={styles.walleticon}>
                                                <button onClick={() => handleNavigation('/Userauthorization/FiatManagement/MyWallet')}>
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
                                                    {userId ? (
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
                                                    {userId ? '' : '₹0.00'}
                                                </span>
                                                <div className={styles.icons}>
                                                    <GoCheck className={styles.checkIcon} />
                                                </div>
                                            </div>
                                            <div>
                                                <button className={styles.viewprofileButton} onClick={() => handleNavigation(`/Userauthorization/UserProfile`)}>
                                                    <span className={styles.text}>Top-up</span>
                                                </button>
                                            </div>
                                            <div>
                                                <button className={styles.manageWalletsButton1} onClick={() => handleNavigation(`/FiatManagement/WithdrawForm`)}>
                                                    <span className={styles.text}>Withdraw</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Wallet);
