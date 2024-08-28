"use client";
import React from 'react';
import { Box, Button, Typography, Tabs, Tab, IconButton } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import styles from './HideAssets.module.css';
import { styled } from '@mui/system';

// import Link from 'next/link';

const HideAssets = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem', // Adjust size as needed
    marginRight: '1rem', // Adjust spacing from the text
  });
  return (
    <div className={styles.pageWrapper}>
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        margin:'0 auto',
        width: '100%',
        maxWidth: '428px',
        height:'auto', // Adjust height for additional content
        minHeight: '100vh' ,
        padding:'20px',
      }}
      
    >
      {/* Header with Back Arrow */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2  , height: '15px'}}>
        <IconButton color="inherit" href="/UserProfile/ProfileSidebar">
          <BackArrow style={{position: 'relative' ,right:'10px'}} className={styles.footerIcon} />
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
            {/* Crypto Tab Content */}
            {/* <Box sx={{ mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 100 }} />
            </Box> */}
            <Box sx={{ mb: 2 }}>
              <Image
                src="/Dupay.image.png" // Update this to the correct image path
                alt="NFT Image"
                width={250}
                height={250}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add crypto to get started
            </Typography>
            <Button
              className={styles.button}
              variant="contained"
              // color="primary"
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
              <Image
                src="/NFTs.image.svg" // Update this to the correct image path
                alt="NFT Image"
                width={250}
                height={250}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Want to buy an NFT?
            </Typography>
            <Button
              className={styles.button}
              variant="contained"
              // color="primary"
              fullWidth
              sx={{ mt: 1, mb: 1 }}
            >
              Add crypto to your wallet
            </Button>
          </>
        )}
      </Box>

      {/* Footer Navigation */}
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider',
          p: 1,
        }}
      > */}
        {/* <Link href="/assets">
          <a>
            <Button sx={{ color: '#fff' }}>
              <Typography>Assets</Typography>
            </Button>
          </a>
        </Link>
        <Link href="/transactions">
          <a>
            <Button sx={{ color: '#fff' }}>
              <Typography>Transactions</Typography>
            </Button>
          </a>
        </Link>
        <Link href="/settings">
          <a>
            <Button sx={{ color: '#fff' }}>
              <Typography>Settings</Typography>
            </Button>
          </a>
        </Link> */}
      {/* </Box> */}
    </Box>
    </div>
  );
};

export default HideAssets;
