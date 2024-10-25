// "use client";

// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
// import { styled } from '@mui/system';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import { useRouter } from 'next/navigation';
// import { FaArrowLeft } from 'react-icons/fa';
// import Link from 'next/link';
// import './ViewProfile.module.css';
// import { redirect } from 'next/navigation';
// import LottieAnimationLoading from '../../assets/LoadingAnimation';

// // Define TypeScript interfaces
// interface UserProfile {
//   user_id?: string;
//   user_profile_photo?: string | { data: number[] };
//   user_first_name?: string;
//   user_middle_name?: string;
//   user_last_name?: string;
//   user_dob?: string;
//   user_email?: string;
//   user_phone_number?: string;
//   user_country?: string;
//   user_city?: string;
//   user_state?: string;
//   user_address_line_1?: string;
//   user_pin_code?: string;
// }

// const StyledContainer = styled(Container)({
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'flex-start',
//   backgroundColor: '#000000',
//   borderRadius: '0px',
//   color: '#FFFFFF',
//   width: '430px',
//   height: 'auto',
//   minHeight: '130vh', // Adjust height for additional content
//   overflowY: 'auto', // Adjust height for additional content
//   scrollbarWidth: 'none', // For Firefox
//   padding: '20px',
//   position: 'relative',
// });

// const ProfileWrapper = styled(Box)({
//   display: 'flex',
//   alignItems: 'center',
//   width: '100%',
//   paddingBottom: '1rem',
//   borderBottom: '1px solid #333',
// });

// const ProfileImageWrapper = styled(Box)({
//   position: 'relative',
//   width: 60,
//   height: 60,
//   marginRight: '1rem',
// });

// const ProfileImage = styled(Avatar)({
//   width: '100%',
//   height: '100%',
// });

// const UploadInput = styled('input')({
//   display: 'none',
// });

// const LabelTypography = styled(Typography)({
//   fontWeight: 'bold',
//   display: 'inline',
//   color: '#B0B0B0',
//   width: '100px',
//   flexShrink: 0,
// });

// const ValueTypography = styled(Typography)({
//   display: 'inline',
//   marginLeft: '0.5rem',
//   flexGrow: 1,
// });

// const InfoRow = styled(Box)({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginBottom: '1rem',
// });

// const StyledButton = styled(Button)({
//   backgroundColor: '#333',
//   color: '#FFFFFF',
//   borderRadius: '16px',
//   textTransform: 'none',
//   padding: '0.25rem 1rem',
//   '&:hover': {
//     backgroundColor: '#444',
//   },
// });

// const ButtonWrapper = styled(Box)({
//   display: 'flex',
//   justifyContent: 'center',
//   marginTop: '1rem',
// });

// const SuccessMessage = styled(Typography)({
//   color: '#2196F3', // Blue color for success message
//   marginTop: '1rem',
// });

// const UserProfile: React.FC = () => {
//   const [users, setUserProfile] = useState<UserProfile>({});
//   const [profileImage, setProfileImage] = useState<string>('');
//   const [successMessage, setSuccessMessage] = useState<string>('');
//   const router = useRouter(); // Initialize useRouter
//   const [showLoader, setShowLoader] = useState<boolean>(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const sessionDataString = window.localStorage.getItem('session_data');
//       if (sessionDataString) {
//         const sessionData = JSON.parse(sessionDataString);
//         const storedUserId = sessionData.user_id;
//         setUserId(storedUserId);
//         console.log(storedUserId);
//         console.log(sessionData.user_email);
//       } else {
//         redirect('http://localhost:3000/Userauthentication/SignIn');
//       }
//     }
//   }, []);

//   const fetchUserProfile = useCallback(async () => {
//     if (!userId) return;

//     try {
//       const response = await axios.get<UserProfile>(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`);
//       setUserProfile(response.data);
//       console.log('User profile data:', response.data);

//       if (response.data.user_profile_photo) {
//         const baseURL = 'http://userprofile-ind-255574993735.asia-south1.run.app/profile_photos';
//         let imageUrl = '';

//         const profilePhoto = response.data.user_profile_photo;

//         if (typeof profilePhoto === 'string' && profilePhoto.startsWith('http')) {
//           imageUrl = profilePhoto;
//         } else if (typeof profilePhoto === 'string' && profilePhoto.startsWith('/')) {
//           imageUrl = `${baseURL}${profilePhoto}`;
//         } else if (typeof profilePhoto === 'object' && profilePhoto.data) {
//           const byteArray = new Uint8Array(profilePhoto.data);
//           const base64String = btoa(byteArray.reduce((data, byte) => data + String.fromCharCode(byte), ''));
//           imageUrl = `data:image/jpeg;base64,${base64String}`;
//           console.log('Base64 Image URL:', imageUrl);
//         }

//         setProfileImage(imageUrl);
//       }
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         console.error('Error fetching user profile:', error.response?.data || error.message);
//       } else {
//         console.error('Error fetching user profile:', (error as Error).message);
//       }
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowLoader(false);
//     }, ); // 2 seconds delay

//     return () => clearTimeout(timer);
//   }, []);

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files[0] && users.user_id) {
//       const file = event.target.files[0];
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target) {
//           setProfileImage(e.target.result as string);
//           uploadImage(file);
//         }
//       };
//       reader.readAsDataURL(file);
//     } else {
//       console.error('User data is missing or file is not selected');
//     }
//   };

//   const uploadImage = async (file: File) => {
//     const formData = new FormData();
    
//     formData.append('user_id', users.user_id || '');
//     formData.append('user_profile_photo', file);
//     formData.append('user_first_name', users.user_first_name || '');
//     formData.append('user_middle_name', users.user_middle_name || '');
//     formData.append('user_last_name', users.user_last_name || '');
//     formData.append('user_dob', users.user_dob || '');
//     formData.append('user_email', users.user_email || '');
//     formData.append('user_phone_number', users.user_phone_number || '');
//     formData.append('user_country', users.user_country || '');
//     formData.append('user_city', users.user_city || '');  
//     formData.append('user_state', users.user_state || '');
//     formData.append('user_address_line_1', users.user_address_line_1 || '');
//     formData.append('user_pin_code', users.user_pin_code || '');

//     try {
//       await axios.put(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setSuccessMessage('Profile image updated successfully!');
//       fetchUserProfile(); 
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         console.error('Error updating profile image:', error.response?.data || error.message);
//       } else {
//         console.error('Error updating profile image:', (error as Error).message);
//       }
//       setSuccessMessage('Failed to update profile image.');
//     }
//   };

//   const getFullName = () => {
//     return `${users.user_first_name || ''} ${users.user_middle_name || ''} ${users.user_last_name || ''}`.trim();
//   };

//   const Header = styled('header')({
//     display: 'flex',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: '1rem',
//   });

//   const styles = {
//     header: {
//       display: 'flex',
//       alignItems: 'center',
//       width: '100%',
//       marginBottom: '1rem', // Adjusted for spacing
//     },
//   };

//   const BackArrow = styled(FaArrowLeft)({
//     cursor: 'pointer',
//     color: '#FFFFFF',
//     fontSize: '1.0rem', // Adjust size as needed
//     marginRight: '1rem', // Adjust spacing from the text
//   });

//   return (
//     <div>
//       <StyledContainer>
//       {showLoader && (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
//         {/* Show the Lottie loading animation */}
//         <LottieAnimationLoading width="300px" height="300px" />
//       </div>
//       )}
//         <header style={styles.header}>
//           <Link href="/UserProfile">
//             <BackArrow />
//           </Link>
//           <Box display="flex" justifyContent="flex-start" width="100%">
//             <Typography variant="h5" gutterBottom>
//               My Profile
//             </Typography>
//           </Box>
//         </header>
//         <ProfileWrapper>
//           <ProfileImageWrapper>
//             <ProfileImage src={profileImage} alt="Profile Image" />
//             <label htmlFor="upload-image">
//               <UploadInput accept="image/*" id="upload-image" type="file" onChange={handleImageChange} />
//               <IconButton
//                 color="default"
//                 aria-label="upload picture"
//                 component="span"
//                 style={{
//                   position: 'absolute',
//                   bottom: -10,
//                   right: -10,
//                   backgroundColor: '#FFFFFF',
//                   borderRadius: '50%',
//                 }}
//               >
//                 <PhotoCamera style={{ color: 'gray' }} />
//               </IconButton>
//             </label>
//           </ProfileImageWrapper>
//           <Box>
//             <Typography variant="h6" style={{ color: '#B0B0B0' }}>
//               {users.user_id || 'loading profile details...'}
//             </Typography>
//           </Box>
//         </ProfileWrapper>
//         <Grid container spacing={1} mt={2}>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Full Name:</LabelTypography>
//               <ValueTypography>{getFullName()}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Email:</LabelTypography>
//               <ValueTypography>{users.user_email}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Dob:</LabelTypography>
//               <ValueTypography>{users.user_dob}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Ph Number:</LabelTypography>
//               <ValueTypography>{users.user_phone_number}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Country:</LabelTypography>
//               <ValueTypography>{users.user_country}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>City:</LabelTypography>
//               <ValueTypography>{users.user_city}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>State:</LabelTypography>
//               <ValueTypography>{users.user_state}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Address:</LabelTypography>
//               <ValueTypography>{users.user_address_line_1}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           <Grid item xs={12}>
//             <InfoRow>
//               <LabelTypography>Pin Code:</LabelTypography>
//               <ValueTypography>{users.user_pin_code}</ValueTypography>
//             </InfoRow>
//           </Grid>
//           {successMessage && (
//             <Grid item xs={12}>
//               <SuccessMessage>{successMessage}</SuccessMessage>
//             </Grid>
//           )}
//         </Grid>
//       </StyledContainer>
//     </div>
//   );
// };

// export default UserProfile;
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Typography, Avatar, IconButton, Grid, Box, Button } from '@mui/material';
import { margin, positions, styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import { MdEdit } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import { redirect } from 'next/navigation';
import LottieAnimationLoading from '../../assets/LoadingAnimation';
import { TextField } from '@mui/material'
// import { styled } from '@mui/material/styles';
import { FormControl, InputLabel ,FormHelperText} from '@mui/material';
import { IoSettings } from "react-icons/io5";

// Define TypeScript interfaces
interface UserProfile {
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
  top:'-70px',
  zIndex: 1000,  
});
const InfoContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  // marginTop: '20px',
  // padding: '20px',
  backgroundColor: '#000000',
  borderRadius: '8px',
  height: 'auto',
  // height:'100vh',
  width: '430px',
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

const UserProfile: React.FC = () => {
  const [users, setUserProfile] = useState<UserProfile>({});
  const [profileImage, setProfileImage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter(); // Initialize useRouter
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
      const response = await axios.get<UserProfile>(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`);
      setUserProfile(response.data);
      console.log('User profile data:', response.data);

      if (response.data.user_profile_photo) {
        const baseURL = 'http://userprofile-ind-255574993735.asia-south1.run.app/profile_photos';
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
      await axios.put(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/profile/${userId}/`, formData, {
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
      height:'175vh',
      // padding: '20px',
      backgroundColor: '#121212',
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
      <div style={styles.container}>
      {showLoader && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      )}
      <img  style={styles.animation} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1729747660/Frame_qityi8.svg" />
      
      {/* <div> */}
        <header style={styles.header}>
          <Link href="/Userauthorization/Dashboard/Home">
          <IoChevronBack style={{color:'white',fontSize:'20px'}}/>
          </Link>
        </header>
        <Box display="flex" justifyContent="flex-end" width="100%">
        <Link href="/Userauthorization/Dashboard/Settings">
          <IoSettings 
            style={{ 
              color: 'white', 
              fontSize: '20px', 
              marginRight: '20px', 
              position: 'relative', 
              top: '-130px' 
            }} 
          />
        </Link>
      </Box>
      <Box display="flex" justifyContent="flex-end" width="100%">
        <Link href="/UserProfile/EditProfile">
          <MdEdit
            style={{ 
              color: 'white', 
              fontSize: '20px', 
              marginRight: '50px', 
              position: 'relative', 
              top: '-150px' 
            }} 
          />
        </Link>
      </Box>

        {/* <div style={styles.image}> */}
        <ProfileWrapper>
          <ProfileImageWrapper>
            <ProfileImage src={profileImage} alt="Profile Image" />
            {/* <label htmlFor="upload-image">
              <UploadInput accept="image/*" id="upload-image" type="file" onChange={handleImageChange} />
              <IconButton
                color="default"
                aria-label="upload picture"
                component="span"
                style={{
                  position: 'absolute',
                  bottom: -10,
                  right: -10,
                  backgroundColor: '#B200ED',
                  borderRadius: '50%',
                }}
              >
                <MdModeEditOutline style={{color:'white'}}/>
              </IconButton>
            </label> */}
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
            
                      {/* <Box display="flex" justifyContent="center" width="100%" style={{ height:'30px' ,marginTop: '10px',marginBottom: '30px'}} >
            <Typography variant="h5" gutterBottom style={{ color: 'white',height:'30px',width:'338px'}}>
              Edit Profile
            </Typography>
          </Box> */}
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            width="100%" 
            sx={{ height: '30px', marginTop: '40px', marginBottom: '10px' }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
              View Profile
            </Typography>
          </Box>
            <div style={{ backgroundColor: 'black',  width:'328px',position:'relative',padding: '10px',
           marginTop: '16px' ,height: 'auto'  }}>
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
                  width:'338px',
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
      </div>
      </div>
      </div>
  );
};

export default UserProfile;


