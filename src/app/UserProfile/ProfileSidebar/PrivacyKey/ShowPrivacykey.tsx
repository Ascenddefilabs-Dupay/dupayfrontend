import React, { useEffect, useState, MouseEvent } from 'react';
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './Privacykey.module.css';
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

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

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
      <Box sx={{ height: '15px'}} className={styles.container}>
        {showLoader && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
        <Container component="main" className={styles.mainContent}>
          <IconButton color="inherit" href="/UserProfile/ProfileSidebar">
            <BackArrow style={{ position: 'relative', right: '10px' }} className={styles.footerIcon} />
          </IconButton>
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Show private key
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter your password to show your ethereum private key. Turn off screen sharing. Dont share it with anyone.
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
                    onClick={handleClickShowPassword}
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
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
};

export default ShowRecoveryPhrase;
