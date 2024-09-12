"use client"
import React, { useState, useCallback, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './AddBankForm.module.css';
import dynamic from 'next/dynamic';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

interface UseAuth {
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const useAuth = (): UseAuth => {
  const isAuthenticated = true; 
  const hasRole = (role: string) => role === 'admin'; 
  return { isAuthenticated, hasRole };
};

const AddBankForm: React.FC = () => {
  const [bankName, setBankName] = useState<string>('');
  const [bankIcon, setBankIcon] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dots, setDots] = useState<number>(0); // State for dots animation

  const router = useRouter();
  const { isAuthenticated, hasRole } = useAuth();
  const { isLoggedIn } = UseSession();

  useEffect(() => {
    // if (typeof window !== 'undefined') {
    //   const sessionDataString = window.localStorage.getItem('session_data');
    //   if (sessionDataString) {
    //     const sessionData = JSON.parse(sessionDataString);
    //     const storedUserId = sessionData.user_id;
    //     // setUserId(storedUserId);
    //     console.log(storedUserId);
    //     console.log(sessionData.user_email);
 
    //   } else {
    //     router.push('http://localhost:3000/Userauthentication/SignIn')
    //   }
    // }
  }, []);

  useEffect(() => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % 4); // Cycles through 0 to 3
      }, 500); // Adjust timing for faster/slower animation
      return () => clearInterval(interval); // Cleanup interval on unmount or when isSubmitting changes
    }
  }, [isSubmitting]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!bankName || !bankIcon) {
        setErrors({ message: 'Please fill all fields' });
        return;
      }

      setIsSubmitting(true);  // Set isSubmitting to true when form submission starts

      const formData = new FormData();
      formData.append('bank_name', bankName);
      formData.append('bank_icon', bankIcon);

      try {
        const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/banks/', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          setAlertMessage('Bank added successfully!');
          // router.push('/Userauthorization/Dashboard');
          setBankName('');
          setBankIcon(null);
          setStatusMessage('');
          setErrors({});
        } else {
          const errorData = await res.json();
          const errorMessages = Object.values(errorData).flat().join(', ');
          setAlertMessage(`Failed to add bank: ${errorMessages}`);
          setStatusMessage('Failed to add bank.');
        }
      } catch (error: any) {
        console.error('Error:', error);
        setAlertMessage(`An error occurred: ${error.message}`);
        setStatusMessage('An error occurred.');
      } finally {
        setIsSubmitting(false);  // Reset isSubmitting after form submission is completed
      }
    },
    [bankName, bankIcon, router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const handleLeftArrowClick = useCallback(() => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard';
      setShowLoader(false); 
    }, 1000); 
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
  }, []);

  if (!isAuthenticated || !hasRole('admin')) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className={styles.container}>
      {alertMessage && (
        <div className={styles.customAlert}>
          <p>{alertMessage}</p>
          <button onClick={handleCloseAlert} className={styles.closeButton}>OK</button>
        </div>
      )}
        
      <div className={styles.topBar}>
        {showLoader && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
        <button className={styles.topBarButton}>
          <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick}/>
        </button>
        <h2 className={styles.topBarTitle}>Add Bank</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Bank Name:</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className={styles.input}
          />
          {errors.bank_name && <p className={styles.error}>{errors.bank_name}</p>}
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Upload Icon:</label>
          <input
            type="file"
            onChange={(e) => setBankIcon(e.target.files ? e.target.files[0] : null)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? `Processing${'.'.repeat(dots)}` : 'Add'}
        </button>
      </form>
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

export default dynamic(() => Promise.resolve(AddBankForm), { ssr: false });
