"use client";

import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Define the type for style objects
interface Styles {
    loaderContainer: React.CSSProperties;
    loader: React.CSSProperties;
    loadingText: React.CSSProperties;
}

// Define the styles with proper TypeScript types
const styles: Styles = {
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 1.5)', // Set background color to black
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        zIndex: 2,
        padding: '20px',
        borderRadius: '20px',
        width: '400px',
        margin: '0 auto',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
    },
    loader: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(45deg, #ff007b, #007bff)',
        // borderRadius: '12%',
        animation: 'spin 1s linear infinite',
        transform: 'rotate(45deg)',
        position: 'relative',
        zIndex: 3,
        boxShadow: '0 0 20px rgba(255, 0, 123, 0.7), 0 0 20px rgba(0, 123, 255, 0.7)',
    },
    loadingText: {
        fontSize: '20px',
        color: 'white',
        letterSpacing: '2px',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
    },
};

const Cryptowallet: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null); // Move useState inside component
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

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

    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard/Home'); // Navigate after delay
        }, 500); // Adjust delay if needed
    };

    return (
        <div>
            <div style={{ padding: '20px', backgroundColor: 'black', width: '400px', margin: '0 auto', height: '100vh', display: 'flex', color: 'white', flexDirection: 'column' }}>
                {loading ? (
                    <div style={styles.loaderContainer}>
                        <div style={styles.loader}></div>
                    </div>
                ) : (
                    <>
                        <div>
                            <IconButton className="backarrow" onClick={handleBackClick} sx={{ color: 'white' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            Crypto wallet
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Cryptowallet);
