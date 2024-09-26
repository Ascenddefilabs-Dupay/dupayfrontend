// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+
// import axios from 'axios';
// import LogPasscode from '../signlogpassword/logpassword';
// import Home from './Home/Home'; 
// import BottomNavBar from './BottomNavBar/BottomNavBar';
// import Loading from './loading'; 
// const Page = () => {
//   const [hasError, setHasError] = useState(false);
//   const [loading, setLoading] = useState(true); // To handle initial loading state
//   const router = useRouter();
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//       if (typeof window !== 'undefined') {
//         const sessionDataString = window.localStorage.getItem('session_data');
//         if (sessionDataString) {
//           const sessionData = JSON.parse(sessionDataString);
//           const storedUserId = sessionData.user_id;
//           setUserId( storedUserId);
//           console.log(storedUserId);
//           console.log(sessionData.user_email);
//         } else {
//           // redirect('http://localhost:3000/Userauthentication/SignIn');
//         }
//       }
//     }, [router]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const response = await axios.get('http://127.0.0.1:8000/userauthorizationapi/logpassword/');
      
//           await axios.post('http://127.0.0.1:8000/userauthorizationapi/logpassword/'), {
//             userId: userId,
//         };
        
//         if (response.data.status === 'Error') {  
//           setHasError(true);
//         } else {
//           router.push('/Userauthorization/signlogpassword/');
//           // setHasError(false);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchData();
//   }, [router]);

//   if (loading) {
//     return <Loading />; 
//   }

//   return (
//     <>
//       {hasError ? (
//         <Home />
//       ) : (
//         <LogPasscode />
//       )}
//     </>
//   );
// };

// export default Page;


// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+
// // import axios from 'axios';
// // import LogPasscode from '../signlogpassword/logpassword';
// // import Home from './Home/Home'; 
// // import BottomNavBar from './BottomNavBar/BottomNavBar';
// // import Loading from './loading'; 

// // const Page = () => {
// //   const [hasError, setHasError] = useState(false);
// //   const [loading, setLoading] = useState(true); // To handle initial loading state
// //   const router = useRouter();
// //   const [userId, setUserId] = useState(null); // Remove the TypeScript annotation

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       const sessionDataString = window.localStorage.getItem('session_data');
// //       if (sessionDataString) {
// //         const sessionData = JSON.parse(sessionDataString);
// //         const storedUserId = sessionData.user_id;
// //         setUserId(storedUserId);
// //         console.log(storedUserId);
// //         console.log(sessionData.user_email);
// //       } else {
// //         // redirect('http://localhost:3000/Userauthentication/SignIn');
// //       }
// //     }
// //   }, [router]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         await axios.post('http://127.0.0.1:8000/userauthorizationapi/logpassword/', {
// //           userId: userId,
// //         });
        
// //         // Assuming response contains a status property
// //         if (response.data.status === 'Error') {  
// //           setHasError(true);
// //         } else {
// //           router.push('/Userauthorization/signlogpassword/');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       } finally {
// //         setLoading(false); 
// //       }
// //     };

// //     fetchData();
// //   }, [router]);

// //   if (loading) {
// //     return <Loading />; 
// //   }

// //   return (
// //     <>
// //       {hasError ? (
// //         <Home />
// //       ) : (
// //         <LogPasscode />
// //       )}
// //     </>
// //   );
// // };

// // export default Page;
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+
import axios from 'axios';
import LogPasscode from '../signlogpassword/logpassword';
import Home from './Home/Home'; 
import BottomNavBar from './BottomNavBar/BottomNavBar';
import Loading from './loading'; 

const Page = () => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true); // To handle initial loading state
  const router = useRouter();
  const [userId, setUserId] = useState(null);

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
        // redirect('http://localhost:3000/Userauthentication/SignIn');
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/userauthorizationapi/logpassword/', {
          userId: userId,
        });

        if (response.data.status === 'Error') {  
          setHasError(true);
        } else {
          router.push('/Userauthorization/signlogpassword/');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); 
      }
    };

    if (userId) { // Ensure userId is set before making the request
      fetchData();
    }
  }, [router, userId]);

  if (loading) {
    return <Loading />; 
  }

  return (
    <>
      {hasError ? (
        <Home />
      ) : (
        <LogPasscode />
      )}
    </>
  );
};

export default Page;
