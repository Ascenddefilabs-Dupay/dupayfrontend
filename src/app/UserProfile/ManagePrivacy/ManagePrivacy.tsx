"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Box, Modal, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import styles from './PrivacySettings.module.css';
import { redirect } from 'next/navigation';


// Define types for the response from the API
interface UserProfileResponse {
  profile_privacy: string;
}

// Define styles using Material-UI's styled API
const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#000000',
  borderRadius: '0px',
  color: '#FFFFFF',
  width: '428px',
  height: 'auto',
  minHeight: '130vh',
  overflowY: 'auto',
  scrollbarWidth: 'none', // For Firefox
  padding: '20px',
});

// Define styles as a TypeScript object
const stylesObject = {
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem',
  },
  manage: {
    fontSize: '1.3rem',
    color: '#FFFFFF',
    marginLeft: '1px',
  },
  privacyOptions: {
    width: '100%',
    flexGrow: 1,
    overflowY: 'auto',
    paddingBottom: '1rem',
  },
  privacyCard: {
    margin: '6px 0',
    backgroundColor: '#1f1f1f',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: 'border-color 0.3s',
    color: '#FFFFFF',
  },
  active: {
    border: '1px solid #1E88E5',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  recommended: {
    color: '#1E88E5',
    fontSize: '0.75rem',
    marginLeft: '5px',
  },
  description: {
    color: '#9E9E9E',
    marginLeft: '1px',
    fontSize: '0.85rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
    width: '100%',
  },
  footerItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#FFFFFF',
  },
  modal: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#FFFFFF',
    backgroundColor: '#000000',
    padding: '16px',
    border: '1px solid #000000',
    width: '320px',
  },
};

// Define the BackArrow styled component
const BackArrow = styled(FaArrowLeft)({
  cursor: 'pointer',
  color: '#FFFFFF',
  fontSize: '1.0rem',
  marginRight: '1rem',
});

const ManagePrivacy: React.FC = () => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(true);

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

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    console.log(userId)
    try {
      const response = await axios.get<UserProfileResponse>(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`);
      setIsPublic(response.data.profile_privacy === 'public');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // const handleToggle = (publicStatus: boolean) => {
  //   if (!userId) return;

  const handleToggle = (publicStatus: boolean) => {
      setIsPublic(publicStatus);
      axios.patch(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`, { profile_privacy: publicStatus ? 'public' : 'private' })
          .then(response => {
              console.log('Privacy updated successfully', response.data);
              setClose(true);
              
          })
          .catch(error => {
              console.error('Error updating privacy', error);
              setError(true);
              
          });
      setOpen(true);
  };

  const handleOpen = () => setOpen(false);
  const handleClose = () => setClose(false);
  const handleError = () => setError(false);
  return (
    <div className={styles.pageWrapper}>
    <StyledContainer>
        <header style={stylesObject.header}>
            <Link href="/UserProfile">
            <BackArrow />
            </Link>
            <Box display="flex" justifyContent="flex-start" width="100%">
            <Typography variant="h5" gutterBottom>
                Manage Privacy
            </Typography>
        </Box>
        </header>
        
        <Box sx={stylesObject.privacyOptions}>
            <Card
                style={{ ...stylesObject.privacyCard, ...(isPublic ? stylesObject.active : {}) }}
                onClick={() => handleToggle(true)}
            >
                <CardContent>
                    <Typography variant="h6" sx={stylesObject.cardTitle}>
                        Public <span style={stylesObject.recommended}>Recommended</span>
                    </Typography>
                    <Typography variant="body2" sx={stylesObject.description}>
                        Anyone can search for your username and see your profile details.
                    </Typography>
                </CardContent>
            </Card>
            <Card
                style={{ ...stylesObject.privacyCard, ...(!isPublic ? stylesObject.active : {}) }}
                onClick={() => handleToggle(false)}
            >
                <CardContent>
                    <Typography variant="h6" sx={stylesObject.cardTitle}>Private</Typography>
                    <Typography variant="body2" sx={stylesObject.description}>
                        Your username and profile details will be hidden from public view.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
        
        <ToastContainer />
        <Modal open={open} onClose={handleOpen}>
            <Box sx={stylesObject.modal}>
                <Typography variant="h6" component="h2">
                    Privacy updated
                </Typography>
                <Button onClick={handleOpen}>Ok</Button>
            </Box>
        </Modal>
        <Modal open={close} onClose={handleClose}>
            <Box sx={stylesObject.modal}>
                <Typography variant="h6" component="h2">
                Privacy updated successfully
                </Typography>
                <Button onClick={handleClose}>Ok</Button>
            </Box>
        </Modal>
        <Modal open={error} onClose={handleError}>
            <Box sx={stylesObject.modal}>
                <Typography variant="h6" component="h2">
                    Error updating privacy
                </Typography>
                <Button onClick={handleError}>Ok</Button>
            </Box>
        </Modal>
    </StyledContainer>
    </div>
);
};
export default ManagePrivacy;