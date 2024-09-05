"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEllipsisV, faChevronLeft, faChevronRight, faHome, faClock, faBookmark } from '@fortawesome/free-solid-svg-icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './bookmark.module.css';

const Buypage = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    router.push('/Crypto_Wallet/Dashboard/BottomNavBar/browser_btn');
  };

  const handleBookmarksClick = () => {
    router.push('/Crypto_Wallet/Dashboard/BottomNavBar/browser_btn/bookmarks');
  };

  const handleHome = () => {
    router.push('/Crypto_Wallet/Dashboard/BottomNavBar/browser_btn');
  };

  const handleHistoryClick = () => {
    router.push('/Crypto_Wallet/Dashboard/BottomNavBar/browser_btn/history');
  };

  return (
    <div>
      <div className={styles.container}>
        <div>
          <IconButton className={styles.backarrow} onClick={handleBackClick}>
            <ArrowBackIcon sx={{ color: 'white' }} />
          </IconButton>
          Bookmarks page

          <button onClick={toggleDropdown} className={styles.dropdownButton}>
            <FontAwesomeIcon icon={faEllipsisV} className={styles.dropdownIconTrigger} />
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faChevronLeft} className={styles.dropdownIcon} />
                </div>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faChevronRight} className={styles.dropdownIcon} />
                </div>
                <div className={styles.iconWrapper}>
                  <FontAwesomeIcon icon={faHome} onClick={handleHome} className={styles.dropdownIcon} />
                </div>
              </div>

              <div className={styles.dropdownItem}>
                <button onClick={handleBookmarksClick}>
                  <FontAwesomeIcon icon={faBookmark} className={styles.dropdownIcon} /> Bookmarks
                </button>
              </div>
              <div className={styles.dropdownItem}>
                <button onClick={handleHistoryClick}>
                  <FontAwesomeIcon icon={faClock} className={styles.dropdownIcon} /> History
                </button>
              </div>
            </div>
          )}

          <div className={styles.bookmarkSection}>
            <img src="/bookmark_image.jpg" alt="" className={styles.bookmarkImage} />
            <p className={styles.noBookmarksText}>No bookmarks yet</p>
            <p className={styles.instructionsText}>
              To add a bookmark, tap the ⁝ menu in 
            </p>
            <p className={styles.instructionsText}>
              your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buypage;
