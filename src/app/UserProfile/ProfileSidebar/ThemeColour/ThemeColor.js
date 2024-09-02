
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import styles from './ThemeColor.module.css';
import { Typography } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';

const colors = ['#3B82F6', '#10B981', '#A78BFA', '#F472B6', '#14B8A6'];

const ThemeColor = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/UserProfile/ProfileSidebar">
          <FaArrowLeft className={styles.backArrow} />
        </Link>
        <br></br>
        <Typography variant="h6">Theme colour</Typography>
      </div>
      <br></br>
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
      <br></br>
      <br></br>
      <Typography>select Color</Typography>
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
      <br></br>
    </div>
    </div>
  );
};

export default ThemeColor;
