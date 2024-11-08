"use client";

import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './createwallet.module.css'; // Import the CSS module
import LottieAnimationLoading from '../../../assets/LoadingAnimation';


const CreateWallet: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            // Uncomment and adjust if needed
            // if (sessionDataString) {
            //     const sessionData = JSON.parse(sessionDataString);
            //     const storedUserId = sessionData.user_id;
            //     setUserId(storedUserId);
            //     console.log(storedUserId);
            //     console.log(sessionData.user_email);
            // } else {
            //     router.push('/Userauthentication/SignIn'); // Redirect if session data is not present
            // }
        }
    }, []);

    const handleBackClick = () => {
        setLoading(true);
        setTimeout(() => {
            router.back();
            setLoading(true);

        }, 500);
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
                {/* Show the Lottie loading animation */}
                <LottieAnimationLoading width="300px" height="300px" />
              </div>
            ) : (
                <>
                    <div>
                        <IconButton className="backarrow" onClick={handleBackClick} sx={{ color: 'white' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        Create Wallet
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(CreateWallet);
