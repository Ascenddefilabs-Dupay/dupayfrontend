"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";
import React from 'react';
import styles from './Cashout.module.css'; // Import the CSS module

// Define the type for your component's state if needed
type CashoutProps = {};

const Cashout: React.FC<CashoutProps> = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    // const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // if (typeof window !== 'undefined') {
        //     const sessionDataString = window.localStorage.getItem('session_data');
        //     if (sessionDataString) {
        //         const sessionData = JSON.parse(sessionDataString);
        //         const storedUserId = sessionData.user_id;
        //         setUserId(storedUserId);
        //         console.log(storedUserId);
        //         console.log(sessionData.user_email);
        //     } else {
        //         router.push('/Userauthentication/SignIn');
        //     }
        // }
    }, [router]);

    const handleBackClick = () => {
        setLoading(true);
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard/Home');
        }, 500);
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            ) : (
                <>
                    <MdOutlineCancel 
                        onClick={handleBackClick}  
                        className={styles.cancelIcon}
                    />
                    <h1 className={styles.heading}>
                        {/* Your heading content here */}
                    </h1>

                    <div className={styles.imageContainer}>
                        <img 
                            src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933125/Cashout_image_odcfls.jpg" 
                            alt="Cashout_Image" 
                            className={styles.image} 
                        />
                    </div>
                    <div className={styles.textContainer}>
                        <p>You are being redirected to</p>                
                        <p>Alchemy Pay to complete cash</p>
                        <p>out process</p>
                    </div>
                    <p className={styles.footerText}>
                        Alchemy Pay is not affiliated with Wallet in any way.
                    </p>         
                    <button 
                        onClick={() => router.push('/Userauthorization/Dashboard')}
                        className={styles.button}
                    >
                        Continue
                    </button>
                </>
            )}
        </div>
    );
}

export default Cashout;
