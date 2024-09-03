"use client";

import Link from 'next/link';
import { FaArrowLeft, FaClock, FaFileAlt, FaCog } from 'react-icons/fa';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import { ArrowForwardIos, Circle, Info } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';
// import './ManageProfile.module.css';
import React, { useState, useEffect } from 'react';


const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1rem',
  backgroundColor: '#000000',
  borderRadius: '0px',
  color: '#FFFFFF',
  width:'428px',
  height:'auto' ,
  minHeight:'120vh',// // Adjust height for additional content
  padding : '20px',
  position: 'relative',
});


const styles = {
  menuList: {
    flex: 1,
    overflowY: 'auto', // Allow vertical scrolling
    marginTop: '20px',

    // Hide scrollbars for WebKit browsers (Chrome, Safari)
    '::-webkit-scrollbar': {
      display: 'none', // Hide scrollbar
    },

    // Hide scrollbars for Firefox
    scrollbarWidth: 'none', // Hide scrollbar

    // Hide scrollbars for Internet Explorer and Edge
    '-msOverflowStyle': 'none', // Hide scrollbar
  }
};
const ButtonLink = styled(Button)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  textTransform: 'none',
  backgroundColor:"gray"
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

const NavLink = styled(Link)({
  color: '#FFFFFF',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
   
  },
});
const Arrow = styled('ArrowForwardIos')({
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
const container = {
  
    display: 'flex',
    justifyContent: 'center',
    width:'400px',
    alignItems: 'center',
    height: 'auto',
    backgroundColor: 'white',

};

const ManageProfile = () => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(true);
  // const userId = localStorage.getItem('user_id');
  // console.log("User_id", userId)
  // if (userId === null) redirect('http://localhost:3000/')
  // const userId = 'DupC0001';
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');
      setUserId(storedUserId);
      // setAlertMessage('User Need To Login')
      if (storedUserId === null) redirect('http://localhost:3000/Userauthentication/SignIn');
      console.log(storedUserId)
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
        setShowLoader(false);
        // setShowForm(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
    }, []);
  const handleLeftArrowClick = () => {
      setShowLoader(true);
      setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false); 
      }, 1000); 
  };
  return (
    <div className={container}>
      {showLoader && (
        <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
        </div>
        )}
    <StyledContainer maxWidth="md">
      <Header>
        {/* <Link > */}
          <BackArrow onClick={handleLeftArrowClick}/>
        {/* </Link> */}
        <MenuTitle>Manage Profile</MenuTitle>
      </Header>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink href="/UserProfile/EditProfile">
              Edit Profile Details 
              <ArrowForwardIos
                className={styles.menuLink}
                style={{ fontSize: '1rem', marginLeft: '180px' }} // Add margin-left to create space
                onClick={() => router.push('/UserProfile/EditProfile')}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/UserProfile/ManagePrivacy">
              Manage Privacy 
              <ArrowForwardIos
                className={styles.menuLink}
                style={{ fontSize: '1rem', marginLeft: '195px' }} // Add margin-left to create space
                onClick={() => router.push('/UserProfile/ManagePrivacy')}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/UserProfile/ViewProfile">
              View Your Profile 
              <ArrowForwardIos
                className={styles.menuLink}
                style={{ fontSize: '1rem', marginLeft: '190px' }} // Add margin-left to create space
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
