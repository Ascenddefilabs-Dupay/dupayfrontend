import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const UseSession = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // Store user data including user_id

  useEffect(() => {
    const checkSession = () => {
      const sessionData = JSON.parse(localStorage.getItem('session_data'));
      if (sessionData) {
        const now = new Date();
        const expirationDate = new Date(sessionData.expiration);
        
        if (now > expirationDate) {
          clearSession();
          alert('Session expired. Please log in again.');
          router.push('/SignIn');
          window.location.reload();
        } else {
          setIsLoggedIn(true);
          setUserData(sessionData); // Store session data, including user_id
          
          const timeUntilExpiration = expirationDate.getTime() - now.getTime();
          setTimeout(() => {
            clearSession();
            // alert('Session expired. Please log in again.');
            router.push('/SignIn');
            window.location.reload();
          }, timeUntilExpiration);
        }
      }
    };

    checkSession();

    const intervalId = setInterval(checkSession, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [router]);

  const clearSession = () => {
    Cookies.remove('user_id');
    Cookies.remove('user_first_name');
    Cookies.remove('user_email');
    Cookies.remove('user_phone_number');
    Cookies.remove('session_id');
    localStorage.removeItem('session_data');
    setIsLoggedIn(false);
    setUserData(null);
  };

  return { isLoggedIn, userData, clearSession };
};

export default UseSession;
