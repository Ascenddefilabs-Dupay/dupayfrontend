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
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string>('');
  const { isAuthenticated, hasRole } = useAuth();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const { isLoggedIn, userData, clearSession } = UseSession();

  useEffect(() => {
    if (!isLoggedIn) {
      // router.push('http://localhost:3000/Userauthentication/SignIn');
    }
  }, [isLoggedIn]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!bankName || !bankIcon) {
        setErrors({ message: 'Please fill all fields' });
        return;
      }

      const formData = new FormData();
      formData.append('bank_name', bankName);
      formData.append('bank_icon', bankIcon);

      try {
        const res = await fetch('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/banks/', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          setAlertMessage('Bank added successfully!');
          router.push('/Userauthorization/Dashboard');
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
        <button type="submit" className={styles.submitButton}>Add</button>
      </form>
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

export default dynamic(() => Promise.resolve(AddBankForm), { ssr: false });