'use client';

import {useRouter} from 'next/navigation';
import { useState, useEffect} from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './connectledger.module.css';
import { redirect } from 'next/navigation';


const Connectledger = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const sessionDataString = window.localStorage.getItem('session_data');
        if (sessionDataString) {
          const sessionData = JSON.parse(sessionDataString);
          const storedUserId = sessionData.user_id;
          setUserId(storedUserId);
          console.log(storedUserId);
          console.log(sessionData.user_email);
        } else {
          redirect('http://localhost:3000/Userauthentication/SignIn');
        }
      }
    }, []);
    

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            // setShowForm(true);
        }, 2000); // 2 seconds delay
    
        return () => clearTimeout(timer);
      }, []);

      const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
        router.push('/Userauthorization/Dashboard/addmanagewallets_btn');
        setLoading(false); 
      }, 1000); 
    }

return(        
    <div className={styles.container}>
         {loading ? (
        <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        </div>
      ) : (
        <>
        <div className={styles.backButton}>
            <IconButton onClick={handleBackClick} sx={{color: '#fff'}}>
            <ArrowBackIcon />
            </IconButton>
        </div>
        <div className={styles.progressBar}></div>
            <h1 className={styles.heading}> Connect your Ledger </h1>
            <div className={styles.imageContainer}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933125/Connectledger_uyu9ve.svg" alt="Center Logo" />
            </div>
            <ol className={styles.ol}>
                <li className={styles.li}>Close any other apps your Ledger is connected to, including Ledger Live.</li>
                <li className={styles.li}>Plug your Ledger into your computer.</li>
                <li className={styles.li}>Unlock your Ledger and open the Ethereum app.</li>
            </ol>  

            <button className={styles.connectNowButton} onClick={() => console.log('connectnow button is clicked')}>
                Connect now
            </button>      

            <div className={styles.link}>
                <a href="https://help.Dupay.com/en/wallet/other-topics/troubleshooting-and-tips">Having trouble?</a>
            </div>  
            </>
      )}
    </div>
        )
    }
    export default Connectledger;