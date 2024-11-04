"use client";

import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LottieAnimationLoading from '../../../assets/LoadingAnimation';


// Define the type for style objects
interface Styles {
    loaderContainer: React.CSSProperties;
    loader: React.CSSProperties;
    loadingText: React.CSSProperties;
}

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
            setLoading(true);
        }, 500); // Adjust delay if needed
    };

    return (
        <div>
            <div style={{ padding: '20px', backgroundColor: 'black', width: '400px', margin: '0 auto', height: '100vh', display: 'flex', color: 'white', flexDirection: 'column' }}>
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
                            Crypto wallet
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Cryptowallet);
