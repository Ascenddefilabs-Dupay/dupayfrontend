"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Link, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import styles from './AddCrypto.module.css'; // Import the CSS file

const AddCrypto = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    setLoading(true); // Show loading text
    setTimeout(() => {
      router.push('/Userauthorization/Dashboard'); // Ensure the correct path here
      setLoading(false); 
    }, 1000); 
  };

  const handleAddCryptoClick = () => {
    setLoading(true); // Show loading text
    setTimeout(() => {
      console.log('Add crypto with Dupay Onramp clicked');
      setLoading(false); 
    }, 1000); 
  };

  const handleTransferClick = () => {
    console.log('Transfer from another wallet clicked');
  };

  return (
    <Box className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, width: '100%' }}>
              <IconButton onClick={handleBackClick} sx={{ color: '#fff' }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ textAlign: 'left', flexGrow: 1, color: '#fff' }}>
                Add Crypto
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <img src="/crypto.png" alt="Dupay" className={styles.img} />
          </Box>

          <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '22px', color: '#fff' }}>
            Buy or transfer from Dupay
          </Typography>
          
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'gray' }}>
            You can add crypto from your Dupay account or transfer from another wallet
          </Typography>

          <Button className={styles.addButton} onClick={handleAddCryptoClick}>
            Add Crypto with Dupay Onramp
          </Button>
          
          <Button className={styles.tipsButton} onClick={handleTransferClick}>
            Transfer from another wallet
          </Button>
        </>
      )}
    </Box>
  );
};

export default AddCrypto;
