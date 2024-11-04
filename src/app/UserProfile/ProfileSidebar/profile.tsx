"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { IconButton, Switch, Typography, Box } from '@mui/material';
import { ArrowForwardIos, Circle, Info } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './ProfileSidebar.module.css';
import { FaArrowLeft } from 'react-icons/fa';
import { redirect } from 'next/navigation';

const ProfileWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingBottom: '0.5px',
});
const BackArrow = styled(FaArrowLeft)({
  cursor: 'pointer',
  color: '#FFFFFF',
  fontSize: '1.0rem', // Adjust size as needed
  marginRight: '1rem', // Adjust spacing from the text
});
const ProfileImageWrapper = styled(Box)({
  position: 'relative',
  width: 80,
  height: 80,
  marginRight: '1rem',
  paddingBottom: '0.5px',
});

const ProfileImage = styled('img')({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover',
});

interface UserProfileData {
  user_id: string;
  user_profile_photo?: string | { data: number[] };
}

const UserProfile: React.FC = () => {
  const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });
  const [profileImage, setProfileImage] = useState<string>('');
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
        redirect('/Userauthentication/SignIn');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      if (userId) {
        const response = await axios.get<UserProfileData>(`https://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`);
        setUserProfile(response.data);

        if (response.data.user_profile_photo) {
          const baseURL = 'https://userprofile-ind-255574993735.asia-south1.run.app/profile_photos';
          let imageUrl = '';

          if (typeof response.data.user_profile_photo === 'string') {
            // Handle case where user_profile_photo is a string
            if (response.data.user_profile_photo.startsWith('http')) {
              imageUrl = response.data.user_profile_photo;
            } else {
              imageUrl = `${baseURL}${response.data.user_profile_photo}`;
            }
          } else if ('data' in response.data.user_profile_photo) {
            // Handle case where user_profile_photo is an object with data
            const byteArray = new Uint8Array(response.data.user_profile_photo.data);
            const base64String = btoa(
              byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            imageUrl = `data:image/jpeg;base64,${base64String}`;
          }

          setProfileImage(imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const profilehandleBackClick = () => {
    router.push('/Userauthorization/Dashboard/Settings');
  };

  const handleViewProfileClick = () => {
    router.push('/UserProfile/ViewProfile');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.sidebarContainer}>
        <div className={styles.header}>
          <IconButton color="inherit" className={styles.backButton}>
            <BackArrow style={{ position: 'relative', right: '10px' }} onClick={profilehandleBackClick} />
            <label className={styles.header1}>ProfileSidebar</label>
          </IconButton>
        </div>
        <div className={styles.menuList}>
          <ProfileWrapper>
            <ProfileImageWrapper>
              <ProfileImage src={profileImage} alt="Profile Image" />
            </ProfileImageWrapper>
            <Box>
              <Typography variant="h6" style={{ color: '#B0B0B0' }}>
                {user.user_id || 'Loading profile details...'}
              </Typography>
            </Box>
          </ProfileWrapper>
          <div className={styles.buttonContainer}>
            <button onClick={handleViewProfileClick} style={{ width: '100%' }}>View profile</button>
          </div>
          <div className={styles.menuItem}>
            <span>Recovery phrase</span>
            <ArrowForwardIos
              className={styles.menuLink}
              style={{ fontSize: '1rem' }}
              onClick={() => router.push('/UserProfile/ProfileSidebar/RecoveryPhrase')}
            />
          </div>
          <div className={styles.menuItem}>
            <span>Show private key</span>
            <ArrowForwardIos
              className={styles.menuLink}
              style={{ fontSize: '1rem' }}
              onClick={() => router.push('/UserProfile/ProfileSidebar/PrivacyKey')}
            />
          </div>
          <div className={styles.menuItem}>
            <span>Hide Assets</span>
            <ArrowForwardIos
              className={styles.menuLink}
              style={{ fontSize: '1rem' }}
              onClick={() => router.push('/UserProfile/ProfileSidebar/HideAssets')}
            />
          </div>
          <div className={styles.menuItem}>
            <span>Color</span>
            <Circle
              className={styles.colorCircle}
              onClick={() => router.push('/UserProfile/ProfileSidebar/ThemeColour')}
            />
          </div>
          <div className={styles.menuItem}>
            <span>Hide address</span>
            <div className={styles.switchWithIcon}>
              <Info className={styles.infoIcon} />
              <Switch defaultChecked={false} />
            </div>
          </div>
        </div>
        <div className={styles.footer}></div>
      </div>
    </div>
  );
};

export default UserProfile;
