"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FaCheck } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './swap.module.css';
import LottieAnimationLoading from '../../assets/LoadingAnimation';


export default function Swap(): JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // const sessionDataString = window.localStorage.getItem('session_data');
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

    const handleBackClick = (): void => {
        router.push('/Userauthorization/Dashboard/Home');
        setLoading(true); 
    };

 

    const handleNavigation = async (route: string) => {
        router.push(route); // Navigate to the new route
        setLoading(true); 
    };

    return (
        <div className={styles.container}>
            {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , width: '430px' , backgroundColor: 'black', margin: '0 auto'}}>
                {/* Show the Lottie loading animation */}
                <LottieAnimationLoading width="300px" height="300px" />
              </div>
            ) : (
                <>
                    <div style={{ flex: '1' }}> 
                        <ArrowBackIcon onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')} style={{ margin: '10px 15px' }} />
                        <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/swap_image_tcwqal.png" alt="Swap image" style={{ height: '140px', marginLeft: '130px' }} />
                        <header style={{ alignItems: 'center', marginLeft: '110px', fontSize: '20px' }}>
                            Get the best price
                            <p style={{ marginLeft: '20px' }}>
                                when you swap
                            </p>
                        </header>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                            <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '45px' }}><FaCheck /></div>
                            <p style={{ fontSize: '15px', margin: 0 }}>
                                Get the best price
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
                                    we check 75+ DEXs to find the best route and price for your swap
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-20px 0' }}></p>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                            <div style={{ margin: '10px ', color: 'white', fontSize: '20px', marginBottom: '60px' }}><FaCheck style={{ marginTop: '12px' }} /></div>
                            <p style={{ fontSize: '15px', margin: 2 }}>
                                Trade 2+ million tokens
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '2px', margin: '10' }}>
                                  Swap on Base, Ethereum, Arbitrum, Optimism, Polygon, Solana, BNB, and Avalanche networks.
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-20px 0' }}></p>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                            <div style={{ margin: '10px', color: 'white', fontSize: '20px', marginBottom: '50px' }}><FaCheck /></div>
                            <p style={{ fontSize: '15px', margin: 0 }}>
                                Protected with swap simulation
                                <p style={{ color: 'gray', fontSize: '12px', marginLeft: '10px', margin: 0 }}>
                                    Avoid losing funds with swap simulations. We will warn you if your swap might fail.
                                </p>
                            </p>
                        </div>
                        <p style={{ margin: '-5px 0' }}></p>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '10px 20px',
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'black',
                        borderRadius: '0 0 15px 15px'
                    }}>
                        <div>
                            <button
                                 onClick={() => handleNavigation('/FiatManagement/Currency_Conversion')}
                                className={styles.button}
                            >
                                Add crypto to your wallet
                            </button>
                        </div>
                        <div>
                            <button
                                 onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')}
                                 className={`${styles.button} ${styles.learnMore}`}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
