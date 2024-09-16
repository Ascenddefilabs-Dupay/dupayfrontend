"use client";

import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IoMdWallet } from "react-icons/io";
import { IoWallet } from "react-icons/io5";
import styles from './wallet.module.css';

const Wallet: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch or check session data here if needed
    }, [router]);

    const handleBackClick = () => {
        setLoading(true);
        setTimeout(() => {
            // router.push('/Userauthorization/Dashboard');
            router.back();
        }, 500);
    };

    const handleCreateWalletClick = () => {
        router.push('/Userauthorization/wallet/CreateWallet');
    };

    const handleMyWalletClick = () => {
        router.push('/FiatManagement/MyWallet');
    };

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
                                <div className={styles.buttonContent}>
                                    <IoWallet size={28} />
                                    <span>Create Wallet</span>
                                </div>
                            </button>
                            <button className={styles.button} onClick={handleMyWalletClick}>
                                <div className={styles.buttonContent}>
                                    <IoMdWallet size={28} />
                                    <span>My Wallets</span>
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Wallet);
