"use client";

import Link from 'next/link';
import { FaArrowLeft, FaClock, FaFileAlt, FaCog } from 'react-icons/fa';
import { Container, Typography, Box, Button } from '@mui/material';
import { margin, styled } from '@mui/system';
import { ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
import styles from './ManageProfile.module.css';
import React, { useState, useEffect } from 'react';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#000000',
  borderRadius: '0px',
  color: '#FFFFFF',
  width: '435px',
  height: 'auto',
  minHeight: '120vh',
  padding: '20px',
  position: 'relative',
  margin:'0 auto',
});


const ButtonLink = styled(Button)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  textTransform: 'none',
  backgroundColor: 'gray',
});

const Header = styled('header')({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginBottom: '-0.5rem',
  height: '10px',
  size: '10px',
});

const BackArrow = styled(FaArrowLeft)({
  cursor: 'pointer',
  color: '#FFFFFF',
  fontSize: '1.0rem', // Adjust size as needed
  marginRight: '1rem', // Adjust spacing from the text
});

const MenuTitle = styled(Typography)({
  fontSize: '1.3rem',
  color: '#FFFFFF',
});

const Nav = styled('nav')({
  width: '100%',
});

const NavList = styled('ul')({
  listStyleType: 'none',
  padding: 0,
  margin: 0,
});

const NavItem = styled('li')({
  margin: '2.5rem 0',
});


const Arrow = styled(ArrowForwardIos)({
  marginLeft: 'auto',
  color: '#9E9E9E',
  fontSize: '1rem',
});

const Footer = styled('footer')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 'auto',
});

const FooterItem = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: '#FFFFFF',
  cursor: 'pointer',
});
const NavLink = styled(Link)({
  color: '#FFFFFF',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  width: '100%', // Ensure it takes full width
  justifyContent: 'space-between',
});
const container = {
  display: 'flex',
  justifyContent: 'center',
  width: '430px',
  alignItems: 'center',
  height: 'auto',
  backgroundColor: 'white',
  margin:'0 auto',
};

const ManageProfile: React.FC = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      // if (sessionDataString) {
      //   const sessionData = JSON.parse(sessionDataString);
      //   const storedUserId = sessionData.user_id;
      //   setUserId(storedUserId);
      //   console.log(storedUserId);
      //   console.log(sessionData.user_email);
      // } else {
      //   redirect('http://localhost:3000/Userauthentication/SignIn');
      // }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleLeftArrowClick = () => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false);
    }, );
  };

  return (
    <div style={container}>
      <StyledContainer maxWidth="md">
      {showLoader && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
        <Header>
          <BackArrow onClick={handleLeftArrowClick} />
          <MenuTitle>Manage Profile</MenuTitle>
        </Header>
        <Nav>
          <NavList>
            <NavItem>
              <NavLink href="/UserProfile/EditProfile">
                Edit Profile Details
                <Arrow
                  style={{ fontSize: '1rem', marginLeft: '100px' }} // Add margin-left to create space
                  onClick={() => router.push('/UserProfile/EditProfile')}
                />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/UserProfile/ManagePrivacy">
                Manage Privacy
                <Arrow
                  style={{ fontSize: '1rem', marginLeft: '100px' }} // Add margin-left to create space
                  onClick={() => router.push('/UserProfile/ManagePrivacy')}
                />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/UserProfile/ViewProfile">
                View Your Profile
                <Arrow
                  style={{ fontSize: '1rem', marginLeft: '100px' }} // Add margin-left to create space
                  onClick={() => router.push('/UserProfile/ViewProfile')}
                />
              </NavLink>
            </NavItem>
          </NavList>
        </Nav>
      </StyledContainer>
    </div>
  );
};

export default ManageProfile;