"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useRouter } from 'next/navigation';
import {FaArrowLeft, FaClock, FaFileAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';


const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1rem',
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#FFFFFF',
  width: '320px',
  height: '550px', // Adjust height for additional content
  overflowY: 'auto',  // Adjust height for additional content
  scrollbarWidth: 'none', // For Firefox
});



const ProfileWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingBottom: '1rem',
  borderBottom: '1px solid #333',
});

const ProfileImageWrapper = styled(Box)({
  position: 'relative',
  width: 60,
  height: 60,
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
  const [successMessage, setSuccessMessage] = useState('');
  const userId = 'dupC0025'; // Replace with sessionStorage['first_name'] or appropriate user ID retrieval
  const router = useRouter(); // Initialize useRouter

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
      setUserProfile(response.data);
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
    formData.append('user_first_name', users.user_first_name || '');
    formData.append('user_middle_name', users.user_middle_name || '');
    formData.append('user_last_name', users.user_last_name || '');
    formData.append('user_dob', users.user_dob || '');
    formData.append('user_email', users.user_email || '');
    formData.append('user_phone_number', users.user_phone_number || '');
    formData.append('user_country', users.user_country || '');
    formData.append('user_city', users.user_city || '');  
    formData.append('user_state', users.user_state ||'');
    formData.append('user_address_line_1', users.user_address_line_1 || '');
    formData.append('user_pin_code', users.user_pin_code || '');

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

  const getFullName = () => {
    return `${users.user_first_name || ''} ${users.user_middle_name || ''} ${users.user_last_name || ''}`.trim();
  };

  const handleManageProfileClick = () => {
    router.push('/Manageprofile'); // Redirect to ManageProfile.js
  };
 
  const Header = styled('header')({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem',
  });
  
  return (
    <Container maxWidth="md">
      <StyledContainer>
        <Box display="flex" justifyContent="flex-start" width="100%">
          <Typography variant="h5" gutterBottom>
            My Profile
          </Typography>
        </Box>
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
                  bottom: -10,
                  right: -10,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                }}
              >
                <PhotoCamera style={{ color: 'gray' }} />
              </IconButton>
            </label>
          </ProfileImageWrapper>
          <Box>
            <Typography variant="h6" style={{ color: '#B0B0B0' }}>
              {users.user_id}
            </Typography>
          </Box>
        </ProfileWrapper>
        <Grid container spacing={1} mt={2}>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Full Name:</LabelTypography>
              <ValueTypography>{getFullName()}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Email:</LabelTypography>
              <ValueTypography>{users.user_email}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Dob:</LabelTypography>
              <ValueTypography>{users.user_dob}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Ph Number:</LabelTypography>
              <ValueTypography>{users.user_phone_number}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Country:</LabelTypography>
              <ValueTypography>{users.user_country}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>City:</LabelTypography>
              <ValueTypography>{users.user_city}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>State:</LabelTypography>
              <ValueTypography>{users.user_state}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Address:</LabelTypography>
              <ValueTypography>{users.user_address_line_1}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <InfoRow>
              <LabelTypography>Pin Code:</LabelTypography>
              <ValueTypography>{users.user_pin_code}</ValueTypography>
            </InfoRow>
          </Grid>
          <Grid item xs={12}>
            <ButtonWrapper>
              <StyledButton onClick={handleManageProfileClick}>
                Manage Profile
              </StyledButton>
            </ButtonWrapper>
          </Grid>
          {successMessage && (
            <Grid item xs={12}>
              <SuccessMessage>{successMessage}</SuccessMessage>
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    </Container>
  );
};

export default UserProfile;


