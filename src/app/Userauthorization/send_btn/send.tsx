"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './send.module.css';

const Send: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard'); // Navigate after delay
        }, 500); // Adjust delay if needed
    };

    const handleAddCryptoClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/FiatManagement/Currency_Conversion'); // Navigate after delay
        }, 500); // Adjust delay if needed
    };

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            // Uncomment this part if you need session handling
            // if (sessionDataString) {
            //     const sessionData = JSON.parse(sessionDataString);
            //     const storedUserId = sessionData.user_id;
            //     setUserId(storedUserId);
            //     console.log(storedUserId);
            //     console.log(sessionData.user_email);
            // } else {
            //     router.push('/Userauthentication/SignIn');
            // }
        }
    }, [router]);

    return (
        <div className={styles.container}>
            <ArrowBackIcon onClick={handleBackClick} className={styles.backIcon} />
            {loading ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            ) : (
                <>
                    <h1 className={styles.title}>Send</h1>
                    <div className={styles.imageContainer}>
                        <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/send_image_ipuouh.png" alt="Send_Image" className={styles.image} />
                    </div>
                    <div className={styles.description}>
                        <p className={styles.d1}>To send, first add crypto to</p>
                        <p className={styles.d2}>your wallet</p>
                        <div className={styles.additionalInfo}>
                            <p>Use a Dupay account to buy or transfer</p>
                            <p className={styles.ai2}>crypto, or receive assets directly.</p>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button
                            onClick={handleAddCryptoClick}
                            className={styles.button}
                        >
                            Add crypto to your wallet
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Send;
