// 'use client';
// import { useState, useEffect } from 'react';
// import { LocalNotifications } from '@capacitor/local-notifications';
// import Geolocation from '@react-native-community/geolocation'; // Import for React Native
// import Oboarding from './SplashScreen';
// import LottieAnimationLoading from '../../assets/StartingAnimation' // Import Lottie animation

// const HomePage = () => {
//   const [loading, setLoading] = useState(true); // State for loading animation
//   const [permissionFlowComplete, setPermissionFlowComplete] = useState(false); // State to track permission completion

//   useEffect(() => {
//     // Show the loading animation for 3 seconds
//     const loadingTimer = setTimeout(() => {
//       setLoading(false);
//       askNotificationPermission();
//     }, 2800); // 4 seconds delay for animation

//     return () => clearTimeout(loadingTimer); // Clear the timer when component unmounts
//   }, []);

//   // Function to request notification permission
//   const askNotificationPermission = async () => {
//     try {
//       const permission = await LocalNotifications.requestPermissions();
//       if (permission.display === 'granted') {
//         console.log('Notification permission granted');
//         checkAndRequestLocationPermissions();
//       } else {
//         console.log('Notification permission denied');
//         setPermissionFlowComplete(true);
//       }
//     } catch (error) {
//       console.error('Error requesting notification permission:', error);
//     }
//   };

//   // Function to request location permission
//   const checkAndRequestLocationPermissions = async () => {
//     if (navigator && 'geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         () => {
//           console.log('Location permission granted');
//           setPermissionFlowComplete(true); // All permissions done
//         },
//         (err) => {
//           console.error(`Error: ${err.message}`);
//           setPermissionFlowComplete(true);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by your browser.');
//       setPermissionFlowComplete(true);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
//         {/* Show the Lottie loading animation */}
//         <LottieAnimationLoading width="300px" height="300px" />
//       </div>
//     );
//   }

//   if (!permissionFlowComplete) {
//     // Permissions flow is ongoing, so return empty or show a placeholder
//     return <div>
//       <Oboarding />
//     </div>;
//   }

//   return (
//     <div>
//       {/* Render the app's main content after permissions are handled */}
//       <Oboarding />
//     </div>
//   );
// };

// export default HomePage;




'use client'
import React from 'react'
import Splash from './SplashScreen'

const page = () => {
  return (
    <div>
      <Splash />
    </div>
  )
}

export default page
