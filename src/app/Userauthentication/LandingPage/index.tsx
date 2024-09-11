"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import styles from './index.module.css';

const Index = () => {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push('/Userauthentication/SignUp/EmailVerification');
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.image}>
          <Image
            src="/images/landing.jpeg"
            alt="Landing Image"
            width={400}
            height={250}
          />
        </div>
        <div className={styles.text}>
          <h1 className={styles.heading}>THE FUTURE OF MONEY IS HERE</h1>
          <p className={styles.subtext}>We are the most trusted place for people and businesses to buy, sell, and manage crypto.</p>
          <button onClick={handleSignUpClick} className={styles.signupButton}>Sign up</button>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <Image
              src="/images/Dupay.png"
              alt="Brand Logo"
              width={100}
              height={30}
              className={styles.footerImage}
            />
            <div className={styles.footerCopy}>&copy; 2024 DUPAY. All rights reserved.</div>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerLinks}>
              <a href="#">About</a>
              <a href="#">Contact</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
