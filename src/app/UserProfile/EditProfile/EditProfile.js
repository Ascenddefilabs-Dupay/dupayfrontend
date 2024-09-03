"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { redirect } from 'next/navigation';

const styles = {
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px) saturate(180%)',
    WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    zIndex: 2,
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  },
  loader: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(45deg, #ff007b, #007bff)',
    animation: 'spin 1s linear infinite',
    transform: 'rotate(45deg)',
    position: 'relative',
    zIndex: 3,
    boxShadow: '0 0 20px rgba(255, 0, 123, 0.7), 0 0 20px rgba(0, 123, 255, 0.7)',
    borderRadius: '12%',
  },
  loaderBefore: {
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    background: 'rgba(255, 0, 123, 0.3)',
    borderRadius: '15%',
    animation: 'pulse 1.5s infinite ease-in-out',
    zIndex: -1,
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(45deg)' },
    '100%': { transform: 'rotate(405deg)' },
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.6,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
    header: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem',
    },
    backArrow: {
        cursor: 'pointer',
        color: '#FFFFFF',
        fontSize: '1.5rem',
    },
    manage: {
        fontSize: '1.3rem',
        color: '#FFFFFF',
        marginLeft: '1px',
    },
    recommended: {
        color: '#1E88E5',
        fontSize: '0.75rem',
        marginLeft: '1px',
    },
    description: {
        color: '#9E9E9E',
        marginLeft: '0.75px',
        fontSize: '0.75rem',
    },
    user: {
        color: 'white',
        marginLeft: '1.5px',
        fontSize: '0.95rem',
    },
    addr: {
        color: '#B0B0B0',
        marginLeft: '1.5px',
        fontSize: '0.75rem',
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
};

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#000000',
  color: '#FFFFFF',
  width: '428px',
  // maxWidth: '100%',
  minHeight: '130vh',
  padding: '20px',
  margin: '0 auto',
  boxSizing: 'border-box', // Ensures padding is included within the width/height
});

const ProfileWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingBottom: '1rem',
  borderBottom: '1px solid #333',
  cursor: 'pointer',
});

const ProfileImageWrapper = styled(Box)({
  position: 'relative',
  width: 50,
  height: 50,
  marginRight: '1rem',
});

const ProfileImage = styled(Avatar)({
  width: '100%',
  height: '100%',
});

const UploadInput = styled('input')({
  display: 'none',
});

const UserProfile = () => {
  const [users, setUserProfile] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // const userId = 'DupC0001'; // Replace with sessionStorage['first_name'] or appropriate user ID retrieval
  const router = useRouter(); // Initialize useRouter
  const [showLoader, setShowLoader] = useState(true);
  // const userId = localStorage.getItem('user_id');
  // console.log("User_id", userId)
  // if (user_id === null) redirect('http://localhost:3000/')

  const [userId, setUserId] = useState(null);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);
        // setAlertMessage('User Need To Login')
        // if (storedUserId === null) redirect('http://localhost:3000/');
        console.log(storedUserId)
      }
    }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await axios.get(`https://userprofile-rcfpsxcera-uc.a.run.app/userprofileapi/profile/${userId}/`);
      setUserProfile(response.data);
      setName(response.data.name || '');
      setAddress(response.data.address || '');
      console.log('User profile data:', response.data);

      if (response.data.user_profile_photo) {
        const baseURL = 'https://userprofile-rcfpsxcera-uc.a.run.app/profile_photos';
        let imageUrl = '';

        if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
          imageUrl = response.data.user_profile_photo;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
          imageUrl = `${baseURL}${response.data.user_profile_photo}`;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
          const byteArray = new Uint8Array(response.data.user_profile_photo.data);
          const base64String = btoa(
            byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageUrl = `data:image/jpeg;base64,${base64String}`;
          console.log('Base64 Image URL:', imageUrl);
        }

        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setShowLoader(false);
        // setShowForm(true);
    },); // 2 seconds delay

    return () => clearTimeout(timer);
    }, []);
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0] && users.user_id) { // Ensure user data is available
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        uploadImage(file);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('User data is missing or file is not selected');
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('user_id', users.user_id || '');
    formData.append('user_profile_photo', file);
    try {
      await axios.put(`https://userprofile-rcfpsxcera-uc.a.run.app/userprofileapi/profile/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Profile image updated successfully!');
      fetchUserProfile(); 
    } catch (error) {
      console.error('Error updating profile image:', error.response ? error.response.data : error.message);
      setSuccessMessage('Failed to update profile image.');
    }
  };
  return (
    <div>
      <StyledContainer>
      {showLoader && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
        <header style={styles.header}>
          <Link href="/UserProfile">
            <FaArrowLeft style={styles.backArrow} />
          </Link>
        </header>
        <Typography variant="h6" style={styles.manage}>Edit profile details</Typography>
        <Typography variant="body1" style={{ ...styles.description, marginLeft: '1px' }} gutterBottom>
          Your profile is private. You can make it public in <span style={styles.recommended}>Manage privacy</span>. All fields are optional.
        </Typography>
        <ProfileWrapper>
          <ProfileImageWrapper>
            <ProfileImage src={profileImage} alt="Profile Image" />
            <label htmlFor="upload-image">
              <UploadInput accept="image/*" id="upload-image" type="file" onChange={handleImageChange} />
              <IconButton
                color="default"
                aria-label="upload picture"
                component="span"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: -15,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                }}
              >
                <PhotoCamera style={{ color: 'gray' }} />
              </IconButton>
            </label>
          </ProfileImageWrapper>
          <Box>
            <Typography variant="h6" style={styles.user}>
              {users.user_id || 'loading profile details...'}
            </Typography>
          </Box>
        </ProfileWrapper>
      </StyledContainer>
    </div>
  );
};

export default UserProfile;
