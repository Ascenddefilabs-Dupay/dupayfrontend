"use client";

import React from 'react';
import Link from 'next/link';
import styles from './ShowRecoveryPhrase.module.css';
import { Container, TextField, Button, Box, Typography, Checkbox, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ShowRecoveryPhrase = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  return (
    <div className={styles.pageWrapper}>
    <Box className={styles.container}>
      <Container component="main" className={styles.mainContent}>
        <IconButton color="inherit" href="/ManageProfile/ProfileSidebar">
          <FaArrowLeft  style={{position: 'relative' ,right:'10px'}} className={styles.footerIcon} />
        </IconButton>
        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
          Show Recovery Phrase
        </Typography>
        <br></br>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Enter your password to show your recovery phrase. Turn off screen sharing. Don’t share it with anyone.
        </Typography>
        <br></br>
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
                  onClick={togglePasswordVisibility}  // Updated here
                  edge="end"
                >
                  {showPassword }
                </IconButton>
              </InputAdornment>
            ),
            style: { color: 'white' },
          }}
        />
        <br></br>
        <FormControlLabel
          control={<Checkbox />}
          label="I will not share my private key with anyone, including Dupay. If I do, I'll lose my assets."
          className={styles.checkboxLabel}
        />
        <Button
          className={styles.button}
          variant="contained"
          // color="primary"
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
