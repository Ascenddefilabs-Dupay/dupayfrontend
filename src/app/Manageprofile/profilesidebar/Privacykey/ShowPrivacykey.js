

import React, { useState } from 'react';
import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FaArrowLeft, FaWallet, FaListAlt, FaCog } from 'react-icons/fa';
import styles from './Privacykey.module.css';

const ShowRecoveryPhrase = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.pageWrapper}>
    <Box sx={{ height: '15px'}} className={styles.container} >
      <Container component="main" className={styles.mainContent}>
        <IconButton color="inherit" href="/ManageProfile/ProfileSidebar">
          <FaArrowLeft style={{position: 'relative' ,right:'10px'}} className={styles.footerIcon} />
        </IconButton>
        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
          Show private key
        </Typography>
        <br></br>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Enter your password to show your ethereum private key. Turn off screen sharing. Dont share it with anyone.
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
                  onClick={handleClickShowPassword}
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
          Continue
        </Button>
      </Container>
    </Box>
    </div>
  );
};

export default ShowRecoveryPhrase;
