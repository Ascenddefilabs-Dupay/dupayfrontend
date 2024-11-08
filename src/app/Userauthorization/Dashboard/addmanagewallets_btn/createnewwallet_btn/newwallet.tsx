'use client';
import React from 'react';
import styles from './newwallet.module.css';
import { useState, useEffect} from 'react';
import {useRouter} from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";
import LottieAnimationLoading from '../../../../assets/LoadingAnimation';
import { redirect } from 'next/navigation';


const Newwallet = () => {
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
    setLoading(true); 
      }, 1000); 
  }
  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      ) : (
        <>
      <div className={styles.backButton} onClick={() => console.log('Back button clicked')}>
        <IoMdArrowRoundBack onClick={handleBackClick} style={{ color: '#fff' }} />
      </div>
      <div className={styles.progressBar}></div>
      <h1 className={styles.heading} >Create a new wallet</h1>
      <div className={styles.imageContainer}>
        <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933126/NewWallet_hrv3tw.png" alt="Center Logo" />
      </div>
      <p className={styles.paragraph}>
        Your new wallet will be secured by a secret recovery phrase. To keep your crypto safe, 
        write it down and do not share it with anyone. <a href="#" className={styles.link}>Learn more</a>
      </p>
      <button className={styles.continueButton} onClick={() => console.log('Continue button clicked')}>
        Continue
      </button>
      </>
      )}
    </div>
  );
};

export default Newwallet;
