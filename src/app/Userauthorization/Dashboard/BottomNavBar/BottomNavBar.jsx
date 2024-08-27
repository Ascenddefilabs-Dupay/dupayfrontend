"use client"; // This marks the component as a client component

import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { FaRegUserCircle } from "react-icons/fa";
import Typography from '@mui/material/Typography';
import { FiGlobe } from "react-icons/fi";
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios'; // Ensure axios is imported
import styles from './BottomNavBar.module.css'; // Import the CSS module

const BottomNavBar = () => {
  const [selected, setSelected] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const userId = 'dupC0030';

  useEffect(() => {
    // Update selected state based on current route
    if (pathname === '/Userauthentication/Dashboard') {
      setSelected('home');
    } else if (pathname === '/Userauthentication/Dashboard/BottomNavBar/transaction_btn') {
      setSelected('transaction');
    } else if (pathname === '/Userauthentication/Dashboard/BottomNavBar/profileicon_btn') {
      setSelected('profileicon');
    } else if (pathname === '/Userauthentication/Dashboard/BottomNavBar/browser_btn') {
      setSelected('browser');
    }
  }, [pathname]);

  useEffect(() => {
    // Fetch the user profile image
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
        if (response.data.user_profile_photo) {
          const baseURL = 'http://localhost:8000/profile_photos';
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
          }

          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNavigation = (navItem) => {
    setSelected(navItem);
    if (navItem === 'home') {
      router.push('/Userauthorization/Dashboard');
    } else if (navItem === 'transaction') {
      router.push('/Userauthorization/Dashboard/BottomNavBar/transaction_btn');
    } else if (navItem === 'profileicon') {
      router.push('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn');
    } else if (navItem === 'browser') {
      router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn');
    }
  };

  return (
    <div className={styles.bottomNavBar}>
      <NavItem
        icon={<HomeIcon />}
        isSelected={selected === 'home'}
        onClick={() => handleNavigation('home')}
      />
      <NavItem
        icon={<FiGlobe style={{ fontSize: '24px' }} />}
        isSelected={selected === 'browser'}
        onClick={() => handleNavigation('browser')}
      />
      <NavItem
        icon={<AssessmentIcon />}
        isSelected={selected === 'transaction'}
        onClick={() => handleNavigation('transaction')}
      />
      <NavItem
        icon={
          profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '5px',
                marginTop: '8px',
                border: '2px solid white'
              }}
            />
          ) : (
            <FaRegUserCircle style={{ fontSize: '22px' }} />
          )
        }
        isSelected={selected === 'profileicon'}
        onClick={() => handleNavigation('profileicon')}
      />
    </div>
  );
};

const NavItem = ({ icon, label, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.navItem} ${isSelected ? styles.selected : ''}`}
    >
      {icon}
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};

export default BottomNavBar;
