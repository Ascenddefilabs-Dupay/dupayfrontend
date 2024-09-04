"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { redirect } from 'next/navigation';

interface UserProfileData {
  user_id?: string;
  name?: string;
  address?: string;
  user_profile_photo?: string | { data: number[] };
}

const styles = {
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
  minHeight: '130vh',
  padding: '20px',
  margin: '0 auto',
  boxSizing: 'border-box',
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

const UserProfile: React.FC = () => {
  const [users, setUserProfile] = useState<UserProfileData>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();
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

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get<UserProfileData>(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`);
      const data: UserProfileData = response.data;
      setUserProfile(data);
      setName(data.name || '');
      setAddress(data.address || '');
      console.log('User profile data:', data);

      if (data.user_profile_photo) {
        const baseURL = 'http://userprofile-ind-255574993735.asia-south1.run.app/profile_photos';
        let imageUrl = '';

        if (typeof data.user_profile_photo === 'string' && data.user_profile_photo.startsWith('http')) {
          imageUrl = data.user_profile_photo;
        } else if (typeof data.user_profile_photo === 'string' && data.user_profile_photo.startsWith('/')) {
          imageUrl = `${baseURL}${data.user_profile_photo}`;
        } else if (typeof data.user_profile_photo === 'object' && data.user_profile_photo.data) {
          const byteArray = new Uint8Array(data.user_profile_photo.data);
          const base64String = btoa(
            byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '')
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
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && users.user_id) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result.toString());
          uploadImage(file);
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('User data is missing or file is not selected');
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('user_id', users.user_id || '');
    formData.append('user_profile_photo', file);
    try {
      await axios.put(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Profile image updated successfully!');
      fetchUserProfile();
    } catch (error) {
      console.error('Error updating profile image:', error);
      setSuccessMessage('Failed to update profile image.');
    }
  };

  return (
    <div>
      <StyledContainer>
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
