"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './ThemeColor.module.css';
import { Typography } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { redirect } from 'next/navigation';

const colors: string[] = ['#3B82F6', '#10B981', '#A78BFA', '#F472B6', '#14B8A6'];

const ThemeColor: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
  const [showLoader, setShowLoader] = useState<boolean>(true);
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
      setShowLoader(false);
      // setShowForm(true);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/UserProfile/ProfileSidebar">
            <FaArrowLeft className={styles.backArrow} />
          </Link>
          <br />
          <Typography variant="h6">Theme colour</Typography>
        </div>
        <br />
        <div className={styles.design}>
          <div className={styles.row}>
            <div className={styles.circle} style={{ backgroundColor: selectedColor }}></div>
            <div className={styles.circle} style={{ backgroundColor: selectedColor }}></div>
          </div>
          <div className={styles.row}>
            <div className={styles.circle} style={{ backgroundColor: selectedColor }}></div>
            <div className={styles.circle} style={{ backgroundColor: selectedColor }}></div>
          </div>
          <div className={styles.centerCircle} style={{ backgroundColor: selectedColor }}>
            <div className={styles.star}></div>
          </div>
        </div>
        <br />
        <br />
        <Typography>Select Color</Typography>
        <div className={styles.colorSelector}>
          {colors.map((color, index) => (
            <div
              key={index}
              className={styles.colorOption}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            ></div>
          ))}
        </div>
        <br />
      </div>
    </div>
  );
};

export default ThemeColor;
