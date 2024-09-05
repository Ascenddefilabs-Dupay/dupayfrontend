'use client';
import React from 'react';
import { useState, useEffect} from 'react';
import { Box, Button, Typography, Link, IconButton, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import styles from  './AddCrypto.module.css'; // Import the CSS file
import { redirect } from 'next/navigation';


const AddCrypto = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
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

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
        // setShowForm(true);
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
    <Box
      sx={{
        position: 'relative',
        display: 'flex',   
        top: '1px',   
        flexDirection: 'column',
        alignItems: 'center',// Center content vertically
        backgroundColor: '#000',
        color: '#fff',
        height: '110vh',// Ensure the screen height covers the entire viewport
        width: '100%',
        maxWidth: '400px', // Set the screen width to 400px
        padding: 2,
        margin: '0 auto', // Center the box horizontally
        boxSizing: 'border-box', // Include padding in the element's total width and height
      }}
    >
      {loading ? (
        <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        </div>
      ) : (
        <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', marginBottom: 2, width: '100%' }}>
          <IconButton onClick={handleBackClick} sx={{ color: '#fff', marginLeft: -1 }}>
            <ArrowBackIcon />
          </IconButton>          
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'left', flexGrow: 5, color: '#fff', marginLeft: 13, }}>
            Add Crypto
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Box
          className='crypto_picture'
          component="img"
          src="/crypto.png"
          alt="Dupay"
          style={{width: '170px',height: '170px'}}
          
        />
      </Box>
      <Typography   variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold',fontSize: '22px', color: '#fff',
             marginLeft: 0,marginTop: 0, flexGrow: 1,position: 'relative', bottom: '25px'  }} >  Buy or transfer from Dupay 
         </Typography>
         <Typography variant="body2" sx={{ textAlign: 'center' ,color: 'gray', position: 'relative', bottom: '150px' }}>
            You can add crypto from your Dupay account or another wallet.
        </Typography>

        <Button
  variant="outlined"
  color="primary"
  onClick={handleAddCryptoClick}
  sx={{ 
    color: '#fff', 
    borderColor: '#fff', 
    position:'relative',
    bottom: '120px',
    marginTop: -3,
    width: '80%', 
    borderRadius: 5,
    '&:hover': { 
      background: 'linear-gradient(90deg, #007bff9f, #800080)',
      borderColor: '#333'
    } 
  }}
>
  Add crypto with Dupay Onramp
</Button>

      <Button
        variant="outlined"
        color="primary"
        onClick={handleTransferClick}
        sx={{ 
          color: '#fff', 
          borderColor: '#fff', 
          width: '80%', 
          postion: 'relative',
          bottom: '105px',
          borderRadius: 5,
          '&:hover': { 
            background: 'linear-gradient(90deg, #007bff9f, #800080)',
            borderColor: '#333'
          } 
        }}
      >
        Transfer from another wallet
      </Button>
      <Typography variant="caption" display="block" sx={{ marginTop: 2, textAlign: 'center', paddingX: 2, position: 'relative', bottom: '110px' }}>
        <p>Use of Dupay.com's account linkage feature is 
        subject to Dupay.com's{' '}</p>
        <Link href="https://www.Dupay.com/user-agreement" target="_blank" sx={{ color: 'blue' }}>
          User Agreement
        </Link>{' '}
        and{' '}
        <Link href="https://www.Dupay.com/privacy-policy" target="_blank" sx={{ color: 'blue' }}>
          Privacy Policy
        </Link>.
      </Typography>
      </>
      )}
    </Box>
  );
};

export default AddCrypto;
