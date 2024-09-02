'use client';
import React from 'react';
import styles from './newwallet.module.css';
import {useRouter} from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";

const Newwallet = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn')
  }
  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => console.log('Back button clicked')}>
      <IoMdArrowRoundBack onClick={handleBackClick} sx={{ color: '#fff' }}/>
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
    </div>
  );
};

export default Newwallet;
