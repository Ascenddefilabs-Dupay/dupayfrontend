'use client';
import React from 'react';
import styles from './newwallet.module.css';
import { useState, useEffect} from 'react';
import {useRouter} from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";
import { redirect } from 'next/navigation';


const Newwallet = () => {
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
  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
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
        write it down and don't share it with anyone. <a href="#" className={styles.link}>Learn more</a>
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
