// // LocationPermission.tsx
// 'use client';
// import React, { useEffect, useState } from 'react';
// import Geolocation from '@react-native-community/geolocation'; // Import this for React Native
// import Oboarding from './OnBoarding/SplashScreen-1/SplashScreen';
// import { LocalNotifications } from '@capacitor/local-notifications'; // Import LocalNotifications

// const LocationComponent: React.FC = () => {
//   const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
//   const [locationName, setLocationName] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     initializePermissions(); // Initialize permissions when component mounts
//     askNotificationPermission();
//   }, []);

//   const requestLocationAccess = () => {
//     if (navigator && 'geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const coords = {
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           };
//           setLocation(coords);
//           setError(null); // Clear any previous errors
//           await fetchLocationName(coords);
//         },
//         (err) => {
//           setError(`Error: ${err.message}`);
//         }
//       );
//     } else if (Geolocation) { // React Native fallback
//       Geolocation.getCurrentPosition(
//         async (position) => {
//           const coords = {
//             lat: position.coords.latitude,
//             lon: position.coords.longitude,
//           };
//           setLocation(coords);
//           setError(null); // Clear any previous errors
//           await fetchLocationName(coords);
//         },
//         (error) => {
//           setError(`Error: ${error.message}`);
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
//       );
//     } else {
//       setError('Geolocation is not supported by your browser.');
//     }
//   };

//   const fetchLocationName = async (coords: { lat: number; lon: number }) => {
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`);
//       if (!response.ok) throw new Error('Failed to fetch location name.');
//       const data = await response.json();
//       setLocationName(data.display_name);
//     } catch (error) {
//       setError('Error fetching location name.');
//     }
//   };

//   const checkAndRequestLocationPermissions = async () => {
//     return new Promise((resolve, reject) => {
//       if (navigator && 'geolocation' in navigator) {
//         navigator.geolocation.getCurrentPosition(() => {
//           resolve(true);
//         }, (err) => {
//           reject(`Error: ${err.message}`);
//         });
//       } else if (Geolocation) {
//         Geolocation.getCurrentPosition(() => {
//           resolve(true);
//         }, (error) => {
//           reject(`Error: ${error.message}`);
//         });
//       } else {
//         reject('Geolocation is not supported by your browser.');
//       }
//     });
//   };

//   // Function to request notification permission
//   const askNotificationPermission = async () => {
//     const permission = await LocalNotifications.requestPermissions();
//     if (permission.display === 'granted') {
//       console.log('Notification permission granted');
//       // You can add logic to schedule notifications here if needed
//     } else {
//       console.log('Notification permission denied');
//     }
//   };

//   // Combined initialization of permissions
//   const initializePermissions = async () => {
//     try {
//       await checkAndRequestLocationPermissions(); // Request location permissions first
//       await askNotificationPermission(); // Then request notification permissions
//     } catch (error) {
//       console.error('Error initializing permissions:', error);
//       setError(error instanceof Error ? error.message : 'Unknown error');
//     }
//   };

//   const Page = () => {
//     return (
//       <div style={{ textAlign: 'center' }}>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <div>
//           <Oboarding />
//         </div>
//       </div>
//     );
//   };

//   return <Page />;
// };

// export default LocationComponent;



'use client';
import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import Geolocation from '@react-native-community/geolocation'; // Import for React Native
import Oboarding from './OnBoarding/SplashScreen-1/SplashScreen';
import LottieAnimationLoading from './assets/LoadingAnimation'; // Import Lottie animation

const HomePage = () => {
  const [loading, setLoading] = useState(true); // State for loading animation
  const [permissionFlowComplete, setPermissionFlowComplete] = useState(false); // State to track permission completion

  useEffect(() => {
    // Show the loading animation for 3 seconds
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      askNotificationPermission();
    }, 4000); // 4 seconds delay for animation

    return () => clearTimeout(loadingTimer); // Clear the timer when component unmounts
  }, []);

  // Function to request notification permission
  const askNotificationPermission = async () => {
    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display === 'granted') {
        console.log('Notification permission granted');
        checkAndRequestLocationPermissions();
      } else {
        console.log('Notification permission denied');
        setPermissionFlowComplete(true);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Function to request location permission
  const checkAndRequestLocationPermissions = async () => {
    if (navigator && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          console.log('Location permission granted');
          setPermissionFlowComplete(true); // All permissions done
        },
        (err) => {
          console.error(`Error: ${err.message}`);
          setPermissionFlowComplete(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
      setPermissionFlowComplete(true);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
    );
  }

  if (!permissionFlowComplete) {
    // Permissions flow is ongoing, so return empty or show a placeholder
    return <div>
      <Oboarding />
    </div>;
  }

  return (
    <div>
      {/* Render the app's main content after permissions are handled */}
      <Oboarding />
    </div>
  );
};

export default HomePage;
