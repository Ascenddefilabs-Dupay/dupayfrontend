
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { display, height, margin, maxHeight, positions, styled } from '@mui/system';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import styles from './EditProfile.module.css';
import { MdModeEditOutline } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { redirect } from 'next/navigation';
import LottieAnimationLoading from '../../assets/LoadingAnimation';

import { TextField } from '@mui/material'
// import { styled } from '@mui/material/styles';
import { FormControl, InputLabel ,FormHelperText} from '@mui/material';


const UserProfile = process.env.UserProfile

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


const ProfileWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  paddingBottom: '1rem',
  // backgroundColor: "blue",
  // borderBottom: '1px solid #333',
  justifyContent: 'center',  // Horizontal centering
  top:'-70px',
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

const UploadInput = styled('input')({
  display: 'none',
});


const SuccessMessage = styled(Typography)({
  color: '#2196F3', // Blue color for success message
  marginTop: '1rem',
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

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    // Check if the event is from an input change
    if ('files' in event.target && event.target.files && event.target.files[0] && users.user_id) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setProfileImage(e.target.result as string);
          uploadImage(file);
        }
      };
      reader.readAsDataURL(file);
    } else if (event.type === 'click') {
      // Handle button click case
      console.log("Button clicked");
    } else {
      console.error('User data is missing or file is not selected');
    }
  };
  

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0] && users.user_id) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       if (e.target) {
  //         setProfileImage(e.target.result as string);
  //         uploadImage(file);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     console.error('User data is missing or file is not selected');
  //   }
  // };

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
      await axios.put(`${UserrProfile}/userprofileapi/profile/${userId}/`, formData, {
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

  const saveUserProfile = async () => {
    setLoading(false)
    if (!userId) return;

    const updatedData: UserrProfile = {
      user_id: userId,
      user_first_name: users.user_first_name,
      user_last_name: users.user_last_name,
      user_email: users.user_email,
      user_phone_number: users.user_phone_number,
      user_dob:users.user_dob,
      user_country: users.user_country,
      user_city: users.user_city,
      user_state: users.user_state,
      user_address_line_1: users.user_address_line_1,
      user_pin_code: users.user_pin_code,
    };

    try {
      await axios.put(`${UserProfile}/userprofileapi/profile/${userId}/`, updatedData);
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => {
        router.push('/UserProfile/ViewProfile');
      }, 1000);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error updating profile:', error.response?.data || error.message);
      } else {
        console.error('Error updating profile:', (error as Error).message);
      }
      setSuccessMessage('Failed to update profile.');
    }
  };

  const handleBack = () => {
    setLoading(true)
    router.push(`/UserProfile/ViewProfile`);
  }

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
      width:'430px',
      height:'230vh',
      // height:'auto',
      // minHeight: '100%',
      // padding: '20px',
      backgroundColor: '#121212',
      borderRadius: '8px',
      margin:'0 auto',
      paddingBottom: '0',
      overflow: 'hidden',
      // overflow: 'scroll',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      top:'-80px',
      position:'relative',
      left:'30px',
      paddingLeft:'10px',
      marginBottom: '1rem', // Adjusted for spacing
    }as React.CSSProperties,
    animation: {
      position: 'relative',
      top: '10px', // Adds space at the top
    }as React.CSSProperties,
    image: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
    },
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
      {/* {showLoader && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      )} */}
      <img  style={styles.animation} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729747660/Frame_qityi8.svg" />
      {/* <div> */}
        <header style={styles.header}>
          {/* <Button onClick={handleBack} style={{display:"flex-box",alignItems:"flex-start"}}><IoChevronBack style={{color:'white',fontSize:'20px'}}/></Button> */}
          <Link href="/UserProfile/ViewProfile" onClick={handleBack}>
          <IoChevronBack style={{color:'white',fontSize:'20px'}}/>
          </Link>
        </header>
        {/* <div style={styles.image}> */}
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
                  backgroundColor: '#222531',
                  borderRadius: '50%',
                }}
              >
                <MdModeEditOutline style={{color:'white'}}/>
              </IconButton>
            </label>
          </ProfileImageWrapper>
          {/* <Box>
            <Typography variant="h6" style={{ color: '#B0B0B0' }}>
              {users.user_id || 'loading profile details...'}
            </Typography>
          </Box> */}
        </ProfileWrapper>
        {/* </div> */}
        {/* <InfoContainer> */}
        <div style={{ backgroundColor: 'black',  width:'100%',position:'relative',
          borderTopRightRadius: '30px', borderTopLeftRadius:'30px',
          padding: '35px', marginTop: '16px' ,top:'-150px',height: 'auto'  }}>
            <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="100%" 
            sx={{ height: '30px', marginTop: '40px', marginBottom: '10px' }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              Edit Profile
            </Typography>
          </Box>
            <div style={{ backgroundColor: 'black',  width:'328px',position:'relative',padding: '10px',
           marginTop: '16px' ,height: 'auto'  }}>
          {/* <Box display="flex" justifyContent="center" width="100%" style={{ height:'30px' ,marginTop: '10px',marginBottom: '30px'}} >
            <Typography variant="h5" gutterBottom style={{ color: 'white',height:'30px',width:'338px'}}>
              Edit Profile
            </Typography>
          </Box> */}
        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
          {/* <FormHelperText style={{
              paddingLeft: '0px',
              color: 'white',
              marginTop: '8px',
              width: '100%',
              fontSize: '15px',
              textAlign: 'left',
              marginLeft: '3px'  // Move the text further left
          }}>
              First Name
          </FormHelperText> */}

            <FormHelperText style={{paddingLeft:'0px',color: 'white',left:'-10%',marginTop: '8px', width:'100%',fontSize: '15px' ,marginLeft: '3px'}}>First Name</FormHelperText>
            <TextField
                  value={users.user_first_name}
                  onChange={(e) => setUserProfile({ ...users, user_first_name: e.target.value })}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: '#222531',
                      color: 'white',
                      borderRadius: '8px',
                      height: '40.15px',
                      width: '338px',
                    },
                  }}
                  />
            {/* <TextField
              value={users.user_first_name}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  // width:'338px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            /> */}
          </FormControl>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Last Name</FormHelperText>
            <TextField
              value={users.user_last_name}
              onChange={(e) => setUserProfile({ ...users, user_last_name: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Email</FormHelperText>
            <TextField
              value={users.user_email}
              onChange={(e) => setUserProfile({ ...users, user_email: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        {/* <div style={{ marginBottom: '10px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Dob</FormHelperText>
            <TextField
              value={users.user_dob}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
                inputProps: { style: { color: 'white' } },
              }}
              disabled
            />
          </FormControl>
        </div> */}
        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText sx={{ color: 'white', marginTop: '8px', fontSize: '15px', marginLeft: '3px' }}>
              Date of Birth
            </FormHelperText>
            <TextField
              value={users.user_dob}

              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white', // Regular text color
                  borderRadius: '8px',
                  height: '40.15px',
                  width: '338px',
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
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Phone Number</FormHelperText>
            <TextField
              value={users.user_phone_number}
              onChange={(e) => setUserProfile({ ...users, user_phone_number: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Country</FormHelperText>
            <TextField
              value={users.user_country}
              onChange={(e) => setUserProfile({ ...users, user_country: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>City</FormHelperText>
            <TextField
              value={users.user_city}
              onChange={(e) => setUserProfile({ ...users, user_city: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>State</FormHelperText>
            <TextField
              value={users.user_state}
              onChange={(e) => setUserProfile({ ...users, user_state: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Address</FormHelperText>
            <TextField
              value={users.user_address_line_1}
              onChange={(e) => setUserProfile({ ...users, user_address_line_1: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
            />
          </FormControl>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <FormControl fullWidth variant="outlined">
            <FormHelperText style={{ color: 'white', marginTop: '8px', fontSize: '15px',marginLeft: '3px' }}>Pin Code</FormHelperText>
            <TextField
              value={users.user_pin_code}
              onChange={(e) => setUserProfile({ ...users, user_pin_code: e.target.value })}
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: '#222531',
                  color: 'white',
                  borderRadius: '8px',
                  height:'40.15px',
                  width:'338px',
                },
              }}
              // disabled
            />
          </FormControl>
        </div>

      </div>
      <div style={{ marginBottom: '16px',marginTop:'20px' }}>
          <FormControl fullWidth variant="outlined">
              <button onClick={saveUserProfile} style={{ color: 'black',backgroundColor:'#E2F0FF', width:'360px',height:'48px',borderRadius:'8px' }} >Save</button>
          </FormControl>
        </div>

        {successMessage && (
          <div style={{ color: 'blue', marginTop: '16px' }}>
            {successMessage}
          </div>
        )}
      </div>
      </div>
      </>
      )}
      </div>
  );
};

export default UserrProfile;

