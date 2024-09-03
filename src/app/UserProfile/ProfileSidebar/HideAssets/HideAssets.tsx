/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Button, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './HideAssets.module.css';
import { styled } from '@mui/system';
import React, { useEffect, useState, SyntheticEvent } from 'react';
import { redirect } from 'next/navigation';

const HideAssets: React.FC = () => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [showLoader, setShowLoader] = useState<boolean>(true);
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
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem',
    marginRight: '1rem',
  });

  return (
    <div className={styles.pageWrapper}>
      {showLoader && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <Box
        sx={{
          backgroundColor: '#000',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
          width: '100%',
          maxWidth: '428px',
          height: 'auto',
          minHeight: '100vh',
          padding: '20px',
          position: 'relative',
        }}
      >
        {/* Header with Back Arrow */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, height: '15px' }}>
          <IconButton color="inherit" href="/UserProfile/ProfileSidebar">
            <BackArrow style={{ position: 'relative', right: '10px' }} className={styles.footerIcon} />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Hide assets
          </Typography>
        </Box>

        {/* Tabs for Crypto and NFTs */}
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="crypto nft tabs"
          textColor="inherit"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Dupay" />
          <Tab label="NFTs" />
        </Tabs>

        {/* Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {tabValue === 0 && (
            <>
              <Box sx={{ mb: 2 }}>
                <img
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1725004269/Dupay.image_kzvxum.png"
                  alt="Crypto Image"
                  width={250}
                  height={250}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Add crypto to get started
              </Typography>
              <Button
                className={styles.button}
                variant="contained"
                fullWidth
                sx={{ mt: 1, mb: 1 }}
              >
                Add crypto
              </Button>
            </>
          )}

          {tabValue === 1 && (
            <>
              {/* NFTs Tab Content */}
              <Box sx={{ mb: 2 }}>
                <img
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724929556/NFTs.image_vbuci5.svg"
                  alt="NFT Image"
                  width={250}
                  height={250}
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Want to buy an NFT?
              </Typography>
              <Button
                className={styles.button}
                variant="contained"
                fullWidth
                sx={{ mt: 1, mb: 1 }}
              >
                Add crypto to your wallet
              </Button>
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default HideAssets;
