'use client';

import {useRouter} from 'next/navigation';
import { useState, useEffect} from 'react';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './address.module.css';
import { redirect } from 'next/navigation';


const Addaddress = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // const storedUserId = localStorage.getItem('user_id');
      // setUserId(storedUserId);
      // setAlertMessage('User Need To Login')
      // if (storedUserId === null) redirect('http://localhost:3000/');
      // console.log(storedUserId)
      // console.log(userId);
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