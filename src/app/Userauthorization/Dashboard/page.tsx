'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for Next.js 13+
import axios from 'axios';
import LogPasscode from '../signlogpassword/logpassword';
import Home from './Home/Home'; 
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
      } else {
        router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/userauthorizationapi/logpassword1/', {
          params: { userId: userId },
        });
        console.log(response.data)

        if (response.data.status === 'Error') {
          router.push('/Userauthorization/Dashboard/Home');  // Redirect to dashboard if user ID exists
        } else {
          router.push('/Userauthorization/signlogpassword/');  // Redirect to log password if user ID doesn't exist
        }
      } catch (error) {
        console.error('Error checking user ID:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) { // Ensure userId is set before making the request
      checkUserId();
    }
  }, [userId, router]);

  if (loading) {
    return <Loading />; 
  }

  return (
    <>
      {hasError ? (
        <div>Error occurred while fetching user data.</div>
      ) : null}
    </>
  );
};

export default Page;