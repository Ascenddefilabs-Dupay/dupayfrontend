'use client';
import React from 'react';
import SecondaryNavbar from './SecondaryNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page2.module.css';

const Page = () => {
  const router = useRouter();

  const handleDownloadClick = () => {
    router.push('/Userauthentication/SignUp/DownloadExtension');
  };

  return (
    <>
      <SecondaryNavbar />
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          <div className={styles.flexGrow}>
            <div className={styles.mainContent}>
              <div className={styles.contentWrapper}>
                <div className={styles.textContainer}>
                  <p className={styles.heading}>
                    Dupay Wallet is available in your <br /> <span className='block'>country.</span>
                  </p>
                  <p className={styles.subHeading}>
                    Dupay Wallet, our self-custody crypto wallet to trade crypto and collect NFTs, is available in your country.
                  </p>
                  <button 
                    className={styles.button}
                    onClick={handleDownloadClick}
                  >
                    Download Dupay Wallet
                  </button>
                  <div className={styles.linkContainer}>
                    <p className={styles.linkText}>
                      Already have a Dupay account?
                    </p>
                    <Link href='/Userauthentication/signin'>
                      <span className={styles.link}>
                        Sign In
                      </span>
                    </Link>
                  </div>
                </div>
      
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
