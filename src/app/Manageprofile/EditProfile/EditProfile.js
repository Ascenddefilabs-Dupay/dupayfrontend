"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {FaArrowLeft, FaClock, FaFileAlt, FaCog } from 'react-icons/fa';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem', // Adjusted for spacing
    },
    backArrow: {
        cursor: 'pointer',
        color: '#FFFFFF',
        fontSize: '1.5rem', // Increase the size of the arrow
    },
    manage: {
        fontSize: '1.3rem',
        color: '#FFFFFF',
        marginLeft: '1px', // Ensure it starts from the left with some margin
    },
    
    recommended: {
        color: '#1E88E5',
        fontSize: '0.75rem',
        marginLeft: '1px',
    },
    description: {
        color: '#9E9E9E', // Set the desired text color here
        marginLeft: '0.75px',
        fontSize: '0.75rem',
    },
    user: {
        color: 'white', // Set the desired text color here
        marginLeft: '1.5px',
        fontSize: '0.95rem',
    },
    addr: {
        color: '#B0B0B0', // Set the desired text color here
        marginLeft: '1.5px',
        fontSize: '0.75rem',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        margintop: 'auto',
        width: '100%',

    },
    footerItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        color: '#FFFFFF', // Text color for the footer items
    },
};

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1rem',
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#FFFFFF',
  width: '428px',
  height:'auto', // Adjust height for additional content
  minHeight: '100vh' ,
  padding:'20px',
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

const LabelTypography = styled(Typography)({
  fontWeight: 'bold',
  display: 'inline',
  color: '#B0B0B0',
  width: '100px',
  flexShrink: 0,
});

const ValueTypography = styled(Typography)({
  display: 'inline',
  marginLeft: '0.5rem',
  flexGrow: 1,
});

const InfoRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '1rem',
});

const StyledButton = styled(Button)({
  backgroundColor: '#333',
  color: '#FFFFFF',
  borderRadius: '16px',
  textTransform: 'none',
  padding: '0.25rem 1rem',
  '&:hover': {
    backgroundColor: '#444',
  },
});

const ButtonWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
});

const SuccessMessage = styled(Typography)({
  color: '#2196F3', // Blue color for success message
  marginTop: '1rem',
});

const UserProfile = () => {
  const [users, setUserProfile] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId = 'dupC0029'; // Replace with sessionStorage['first_name'] or appropriate user ID retrieval
  const router = useRouter(); // Initialize useRouter

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
      setUserProfile(response.data);
      setName(response.data.name || '');
      setAddress(response.data.address || '');
      console.log('User profile data:', response.data); // Debugging line to check the response data

      if (response.data.user_profile_photo) {
        const baseURL = 'http://localhost:8000/profile_photos';
        let imageUrl = '';

        // Check if the photo is stored as bytes
        if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
          imageUrl = response.data.user_profile_photo;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
          // Handle as a URL path
          imageUrl = `${baseURL}${response.data.user_profile_photo}`;
        } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
          // Handle as bytes (convert to base64)
          const byteArray = new Uint8Array(response.data.user_profile_photo.data);
          const base64String = btoa(
            byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          imageUrl = `data:image/jpeg;base64,${base64String}`; // Change image/jpeg based on your image type
          console.log('Base64 Image URL:', imageUrl); // Debugging line to check the base64 URL
        }

        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
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
      await axios.put(`http://localhost:8000/api/profile/${userId}/`, formData, {
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


  const handleManageprofileClick = () => {
    router.push('Manageprofile/EditProfile'); // Redirect to Manageprofile.js
  };

  const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem', // Adjust size as needed
    marginRight: '1rem', // Adjust spacing from the text
  });
  
  return (
    <div className={styles.pageWrapper}>
    <Container maxWidth="md">
      <StyledContainer>
        <header style={styles.header}>
            <Link href="/Manageprofile">
              <BackArrow />

            </Link>
        </header>
            <Typography variant="h6" style={styles.manage}>Edit profile details</Typography>
            <Typography variant="body1" style={{ ...styles.description, marginLeft: '1px' }} gutterBottom>
                Your profile is private. You can make it public in <span style={styles.recommended}>Manage privacy</span>. All feilds are optional.

            </Typography>
        <ProfileWrapper >
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
                  width:30,
                  height:30
                }}
              >
                <PhotoCamera style={{ color: 'gray' }} />
              </IconButton>
            </label>
          </ProfileImageWrapper>
          <Box>
            <Typography variant="h6" style={styles.user}>
              {users.user_id}
            </Typography>
            
          </Box>
        </ProfileWrapper>
        
      </StyledContainer>
    </Container>
    </div>
  );
};

export default UserProfile;
