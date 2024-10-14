'use client';

import {useRouter} from 'next/navigation';
import { useState, useEffect} from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './address.module.css';
import LottieAnimationLoading from '../../../../assets/LoadingAnimation';
import { redirect } from 'next/navigation';


const Addaddress = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

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
      const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay
      return () => clearTimeout(timer);
    }, []);

    
    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
        router.push('/Userauthorization/Dashboard/addmanagewallets_btn');
        setLoading(true); 
      }, 1000); 
    }

return(        
    <div className={styles.container}>
        {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      ) : (
        <>
        <div className={styles.backButton}>
            <IconButton onClick={handleBackClick} sx={{color: '#fff'}}>
            <ArrowBackIcon />
            </IconButton>
        </div>
        <div className={styles.progressBar}></div>
            <h1 className={styles.heading}>Add an address</h1>
           
            <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933124/Addaddress_koffsx.svg" alt="Center Logo" className= {styles.image}/>
            
            <p className={styles.paragraph}>Each address includes a unique Ethereum and 
                Solana address that belongs to your wallet. 
                You can add up to 15 per wallet. 
                You can import them into other crypto wallets too.</p>

            <button className={styles.continueButton} onClick={() => console.log('continue button is clicked')}>
                Continue</button>        
                </>
      )}
    </div>
        )
    }
    export default Addaddress;