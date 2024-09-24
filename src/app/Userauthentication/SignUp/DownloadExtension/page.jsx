import React from 'react';
import Link from 'next/link';
import ExtensionNavbar from './ExtensionNavbar';
import { FaAppStoreIos } from "react-icons/fa";
import { FaBrave } from "react-icons/fa6";
import styles from './page3.module.css'; // Import the new CSS module

const Extension = () => {
  return (
    <div className={`${styles.container}`}>
      <ExtensionNavbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.title}>Dupay Wallet</p>
        </div>
        <div className={styles.subheader}>
          <p className={styles.description}>
            Dupay Wallet is available as a mobile app and desktop browser extension.
          </p>
        </div>

        <div className={styles.cardGrid}>
          <a 
            href="https://apps.apple.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.card}
          >
            <h3 className={styles.icon}>
              <FaAppStoreIos color="#007AFF" />
            </h3>
            <p className={styles.cardTitle}>Download For iOS</p>
            <p className={styles.cardDescription}>
              Get the Dupay wallet mobile app from the Appstore
            </p>
          </a>

          <Link href="/Landing/SplashScreen-1" passHref>
            <div className={styles.card}>
              <h3 className={styles.icon}>
                <img 
                  src='/images/playstore.png'   
                  alt='Descriptive Alt Text' 
                  className={styles.image} 
                />
              </h3>
              <p className={styles.cardTitle}>Download For Android</p>
              <p className={styles.cardDescription}>
                Get the Dupay wallet mobile app from the Playstore
              </p>
            </div>
          </Link>

          <a 
            href="https://chrome.google.com/webstore/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.card}
          >
            <h3 className={styles.icon}>
              <img 
                src='/images/chrome.png'   
                alt='Descriptive Alt Text' 
                className={styles.image} 
              />
            </h3>
            <p className={styles.cardTitle}>Download for Chrome</p>
            <p className={styles.cardDescription}>
              Get the Dupay wallet extension from the Chrome web store
            </p>
          </a>

          <a 
            href="https://brave.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.card}
          >
            <h3 className={styles.icon}>
              <FaBrave color="#FB542B" />
            </h3>
            <p className={styles.cardTitle}>Download For Brave</p>
            <p className={styles.cardDescription}>
              Get the Dupay wallet extension from the Brave store
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Extension;
