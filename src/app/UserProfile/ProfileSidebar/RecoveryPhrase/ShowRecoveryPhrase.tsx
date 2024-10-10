"use client";

import React, { useEffect, useState, MouseEvent } from 'react';
import Link from 'next/link';
import styles from './ShowRecoveryPhrase.module.css';
import { Container, TextField, Button, Box, Typography, Checkbox, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/system';
import { redirect } from 'next/navigation';

const ShowRecoveryPhrase: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };
  const stylesObject = {
    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '1rem',
    }};
  const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem', // Adjust size as needed
    marginRight: '1rem', // Adjust spacing from the text
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
      // setShowForm(true);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <Box className={styles.container}>
        <Container component="main" className={styles.mainContent}>
        <header style={stylesObject.header}>
            <Link href="/UserProfile/ProfileSidebar">
            <BackArrow />
            </Link>
            <Box display="flex" justifyContent="flex-start" width="100%">
            <Typography variant="h5" gutterBottom>
            Show Recovery Phrase
            </Typography>
        </Box>
        </header>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter your password to show your recovery phrase. Turn off screen sharing. Dont share it with anyone.
          </Typography>
          <Typography>Password</Typography>
          <TextField
            variant="outlined"
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            className={styles.text}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              style: { color: 'white' },
            }}
          />
          <FormControlLabel
            control={<Checkbox />}
            label="I will not share my private key with anyone, including Coinbase. If I do, I'll lose my assets."
            className={styles.checkboxLabel}
          />
          <Button
            className={styles.button}
            variant="contained"
            fullWidth
            sx={{ mt: 1, mb: 1 }}
          >
            Next
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default ShowRecoveryPhrase;