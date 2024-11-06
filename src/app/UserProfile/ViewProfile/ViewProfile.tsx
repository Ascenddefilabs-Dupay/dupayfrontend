// export default UserProfile;
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { height, margin, positions, styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { MdEdit } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { redirect } from 'next/navigation';
import { FaUserEdit } from "react-icons/fa";
// import LottieAnimationLoading from '../../assets/LoadingAnimation';
import { TextField } from '@mui/material'
// import { styled } from '@mui/material/styles';
import { FormControl, InputLabel ,FormHelperText} from '@mui/material';
import { IoSettings } from "react-icons/io5";
import LottieAnimation from '../../assets/animation'
import LottieAnimationLoading from '../../assets/LoadingAnimation';
import { FaUserCircle } from "react-icons/fa";
import dynamic from 'next/dynamic';
const UserProfile = process.env.NEXT_PUBLIC_UserProfile


// Define TypeScript interfaces
interface UserrProfile {
  user_id?: string;
  user_profile_photo?: string | { data: number[] };
  user_first_name?: string;
  user_middle_name?: string;
  user_last_name?: string;
  user_dob?: string;
  user_email?: string;
  user_phone_number?: string;
  user_country?: string;
  user_city?: string;
  user_state?: string;
  user_address_line_1?: string;
  user_pin_code?: string;
}
const AssessmentIcon = dynamic(() =>
  import('@mui/icons-material/Assessment').then((mod) => mod.default)
);
const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: '#434B52',
  borderRadius: '0px',
  color: '#FFFFFF',
  width: '430px',
  height: 'auto',
  minHeight: '130vh', // Adjust height for additional content
  overflowY: 'auto', 
  // scrollbarWidth: 'none', 
  // padding: '20px',
  position: 'relative',
});


const ProfileWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  paddingBottom: '1rem',
  // borderBottom: '1px solid #333',
  justifyContent: 'center',  // Horizontal centering
  top:'-100px',
  zIndex: 1000,  
});

const ProfileImageWrapper = styled(Box)({
  position: 'relative',
  width: 100,
  height: 100,
  // marginRight: '30px',
  // left:'30px',

});

const ProfileImage = styled(Avatar)({
  width: '100%',
  height: '100%',
});


const UserrProfile: React.FC = () => {
  const [users, setUserProfile] = useState<UserrProfile>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter(); // Initialize useRouter
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await axios.get<UserrProfile>(`${UserProfile}/userprofileapi/profile/${userId}/`);
      setUserProfile(response.data);
      console.log('User profile data:', response.data);

      if (response.data.user_profile_photo) {
        const baseURL = '${UserProfile}/profile_photos';
        let imageUrl = '';

        const profilePhoto = response.data.user_profile_photo;

        if (typeof profilePhoto === 'string' && profilePhoto.startsWith('http')) {
          imageUrl = profilePhoto;
        } else if (typeof profilePhoto === 'string' && profilePhoto.startsWith('/')) {
          imageUrl = `${baseURL}${profilePhoto}`;
        } else if (typeof profilePhoto === 'object' && profilePhoto.data) {
          const byteArray = new Uint8Array(profilePhoto.data);
          const base64String = btoa(byteArray.reduce((data, byte) => data + String.fromCharCode(byte), ''));
          imageUrl = `data:image/jpeg;base64,${base64String}`;
          console.log('Base64 Image URL:', imageUrl);
        }

        setProfileImage(imageUrl);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
      } else {
        console.error('Error fetching user profile:', (error as Error).message);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, ); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && users.user_id) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfileImage(e.target.result as string);
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
    formData.append('user_first_name', users.user_first_name || '');
    // formData.append('user_middle_name', users.user_middle_name || '');
    formData.append('user_last_name', users.user_last_name || '');
    formData.append('user_dob', users.user_dob || '');
    formData.append('user_email', users.user_email || '');
    formData.append('user_phone_number', users.user_phone_number || '');
    formData.append('user_country', users.user_country || '');
    formData.append('user_city', users.user_city || '');  
    formData.append('user_state', users.user_state || '');
    formData.append('user_address_line_1', users.user_address_line_1 || '');
    formData.append('user_pin_code', users.user_pin_code || '');

    try {
      await axios.put(`${UserProfile}/userprofileapi/profile/${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Profile image updated successfully!');
      fetchUserProfile(); 
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating profile image:', error.response?.data || error.message);
      } else {
        console.error('Error updating profile image:', (error as Error).message);
      }
      setSuccessMessage('Failed to update profile image.');
    }
  };

  const getFullName = () => {
    return `${users.user_first_name || ''} ${users.user_middle_name || ''} ${users.user_last_name || ''}`.trim();
  };

  const handleBack = () => {
    setLoading(true)
    router.push(`/UserProfile/ViewProfile`);
  }
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hours = new Date().getHours();
      let greetingText;
  
      if (hours >= 5 && hours < 12) {
        greetingText = 'Good morning ';
      } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good afternoon ';
      } else if (hours >= 17 && hours < 21) {
        greetingText = 'Good evening ';
      } else {
        greetingText = 'Good night ';
      }
  
      setGreeting(greetingText);
    };
  
    // Update greeting initially
    updateGreeting();
    
    // Set an interval to update the greeting every minute
    const intervalId = setInterval(updateGreeting, 60000);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  const handleNavigation = (route: string) => {
    router.push(route); 
    setLoading(true); 
  };

  const Header = styled('header')({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem',
  });

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      // justifyContent: 'center',
      // width:'430px',
      width: '100%',
    maxWidth: '430px',
      // height:'168vh',
      height:'100vh',
      // padding: '20px',
      backgroundColor: 'black',
      borderRadius: '8px',
      margin:'0 auto',
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      top:'-90px',
      position:'relative',
      left:'30px',
      paddingLeft:'10px',
      marginBottom: '1rem', // Adjusted for spacing
    }as React.CSSProperties,
    animation: {
      position: 'relative',
      // height:'50px',
      top: '0', // Adds space at the top
    }as React.CSSProperties,
    image: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    homeInner: {
      position: 'fixed',
      bottom: '3.2rem',
      left: '49.5%', // Centers relative to the viewport width
      transform: 'translateX(-49.5%)', // Adjusts the element to the center
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      cursor: 'pointer',
    } as React.CSSProperties,
    
  
      tabbarstabbars: {
        position: 'fixed',
        bottom: '-0.9rem', // Adjusts the distance from the bottom; change '2rem' as needed
        left: 'calc(50% - 214.5px)',
        borderRadius: '8px 8px 0px 0px',
        width: '428px',
        height:'13%',
      display: 'flex',
      flexDirection: 'row' as const,
      backgroundColor: '#121212',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#abafc4',
    }as React.CSSProperties,
  
    content11: {
      position: 'relative',
      width: 'calc(100% - 8px)',
      color: 'white',
      top: '6px',
      right: '4px',
      left: '4px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
    }as React.CSSProperties,
  
    div: {
      width: '125px',
      position: 'relative',
      height: '82px',
      color: '#fff',
    }as React.CSSProperties,
  
    div1: {
      width: '125px',
      position: 'relative',
      height: '82px',
      color: '#fff',
    }as React.CSSProperties,
    div2: {
      width: '125px',
      marginBottom:'20px',
      position: 'relative',
      height: '82px',
      color: '#fff',
    }as React.CSSProperties,
  
    content12: {
      position: 'relative',
      width: 'calc(100% - 8px)',
      color: '#abafc4',
      top: '6px',
      right: '4px',
      left: '4px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
    }as React.CSSProperties,
  
    text: {
      fontSize: '12px',
      lineHeight: '18px',
      alignItems:'center',
      justifyContent:'center',
      display: 'inline-block',
      width: '67px',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif",
    }as React.CSSProperties,
    text1: {
      fontSize: '12px',
      lineHeight: '18px',
      alignItems:'center',
      right:'-10px',
      // justifyContent:'center',
      display: 'inline-block',
      width: '67px',
      position: 'relative',
      fontFamily: "'Poppins', sans-serif",
    }as React.CSSProperties,
    iconbase: {
      width: '24px',
      display:'flex',
      position: 'relative',
      // position:'fixed',
      justifyContent:'center',
      height: '24px',
      overflow: 'hidden',
      flexShrink: 0,
    }as React.CSSProperties,
  };

  const BackArrow = styled(FaArrowLeft)({
    cursor: 'pointer',
    color: '#FFFFFF',
    fontSize: '1.0rem', // Adjust size as needed
    marginRight: '1rem', // Adjust spacing from the text
  });

  return (
    <div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' ,width:'430px', backgroundColor: 'black', margin: '0 auto'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading  />
      </div>
      ) : (
        <>
      <div style={styles.container}>
      {showLoader && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      )}
      <img  style={styles.animation} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074021/Frame_mp4g4t.png" />
      <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    width: '100%',
    color: 'white', 
    fontSize: '16px', 
    lineHeight: '24px', 
    textAlign: 'center', 
    fontFamily: '"Poppins", sans-serif',
    padding: '10px 20px', // Adjust spacing as needed
    position: 'relative', // Allows for vertical positioning
    top: '-130px' // Move the div upwards
}}>
    <span>{greeting}</span>
    <Box display="flex" alignItems="center">
    <Link href="/UserProfile/EditProfile">
            <FaUserEdit
                style={{ 
                    color: 'white', 
                    fontSize: '20px', 
                    marginRight: '8px' 
                }} 
            />
        </Link>
        <Link href="/Userauthorization/Dashboard/Settings">
            <IoSettings 
                style={{ 
                    color: 'white', 
                    fontSize: '20px', 
                    marginRight: '8px' 
                }} 
            />
        </Link>
    </Box>
</div>
        <ProfileWrapper>
          <ProfileImageWrapper>
            <ProfileImage src={profileImage} alt="Profile Image" />
          </ProfileImageWrapper>
        </ProfileWrapper>
        <div style={{ backgroundColor: 'black',  width:'430px',position:'fixed',
          borderTopRightRadius: '30px', borderTopLeftRadius:'30px', left: '50%', 
          padding: '20px', top: '17vh',height:'68%',transform: 'translateX(-50%)',overflow: 'hidden'  }}>
             {/* <ProfileImage src={profileImage} alt="Profile Image" /> */}
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="100%" 
            sx={{ height: '5px', marginTop: '80px', marginBottom: '10px' }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              View Profile
            </Typography>
          </Box>
            <div style={{ backgroundColor: 'black',width: '100%',position:'relative',padding: '10px',
           marginTop: '16px' ,height: '90%',overflowY: 'scroll', 
           scrollbarWidth: 'none',
           overflowX: 'hidden',WebkitOverflowScrolling: 'touch',maxWidth: '378px' }}>
        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{color: 'white',marginTop: '8px', width:'100%',fontSize: '15px' ,marginLeft: '3px' }}>Full Name</FormHelperText>
            <TextField
              value={getFullName()}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  // width:'338px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>Email</FormHelperText>
            <TextField
              value={users.user_email}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>Date of Birth</FormHelperText>
            <TextField
              value={users.user_dob}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>Phone Number</FormHelperText>
            <TextField
              value={users.user_phone_number}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>Country</FormHelperText>
            <TextField
              value={users.user_country}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>City</FormHelperText>
            <TextField
              value={users.user_city}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>State</FormHelperText>
            <TextField
              value={users.user_state}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px'  }}>Address</FormHelperText>
            <TextField
              value={users.user_address_line_1}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'368px',
                },
              }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  color: 'white', // Disabled text color
                  WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray', // Optional: Customize border color when disabled
                },
              }}
              disabled
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: '16px' }}>
        <FormControl fullWidth variant="outlined">
          <FormHelperText sx={{ color: 'white', marginTop: '8px', fontSize: '15px', marginLeft: '3px' }}>
            Pin Code
          </FormHelperText>
          <TextField
            value={users.user_pin_code}
            variant="outlined"
            InputProps={{
              style: {
                backgroundColor: '#222531',
                color: 'white', // Regular text color
                borderRadius: '8px',
                height: '40.15px',
                width: '368px',
              },
            }}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                color: 'white', // Disabled text color
                WebkitTextFillColor: 'white', // Ensures color in Webkit browsers
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray', // Optional: Customize border color when disabled
              },
            }}
            disabled
          />
        </FormControl>
      </div>


      </div>
      {/* <div style={{ marginBottom: '16px',marginTop:'20px' }}>
          <FormControl fullWidth variant="outlined">
              <button style={{ color: 'black',backgroundColor:'#E2F0FF', width:'360px',height:'48px',borderRadius:'8px' }}>Edit</button>
          </FormControl>
        </div> */}

        {successMessage && (
          <div style={{ color: 'blue', marginTop: '16px' }}>
            {successMessage}
          </div>
        )}
      
      {/* </div> */}
      
        {/* <div> */}
        </div> 
      
            <div style={styles.tabbarstabbars}>    
            {/* <div style={styles.homeInner} >
            <LottieAnimation width="33.4px" height="33.4px" />
        </div> */}
        				<div style={styles.div}>
          					<div style={styles.content12} onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/transaction_btn')}>
                        <AssessmentIcon />
            						<b style={styles.text}>Transaction</b>
          					</div>
        				</div>
        				<div style={styles.div2} >
          					<div style={styles.content12} onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')}>
                    <LottieAnimation width="35.4px" height="35.4px" />
            						{/* <img style={styles.iconbase}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" /> */}
            						<b style={styles.text1}>Dupay</b>
          					</div>
        				</div>
        				<div style={styles.div1}>
                <div style={styles.content11}  onClick={() => handleNavigation('/UserProfile/ViewProfile')}>
          					{/* <div className={styles.content11}  onClick={() => handleNavigation('/Userauthorization/Dashboard/Settings')}> */}
            						{/* <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" /> */}
                        {/* <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1728993690/profile_iwqu3x.png" /> */}
                        <FaUserCircle style={{width: '22px', color: 'white'  , height: '22px',marginRight: '25px'}}/>
            						<b style={styles.text}>Profile</b>
          					</div>
        				</div>
      			</div>
      			</div>
      </>
      )}
      </div>
  );
};

export default UserrProfile;
