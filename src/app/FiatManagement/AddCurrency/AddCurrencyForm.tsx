import React, { useState, useCallback, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './AddCurrencyForm.module.css';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';
import { useRouter } from 'next/navigation';

// Type definitions
interface UseAuthHook {
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

// Authentication and role-based access hook (included in the same file)
const useAuth = (): UseAuthHook => {
  const isAuthenticated = true; // Replace with actual authentication logic
  const hasRole = (role: string) => role === 'admin'; // Replace with actual role checking logic
  return { isAuthenticated, hasRole };
};

const AddCurrencyForm: React.FC = () => {
  const [currencyCode, setCurrencyCode] = useState<string>('');
  const [currencyCountry, setCurrencyCountry] = useState<string>('');
  const [currencyIcon, setCurrencyIcon] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('Add');
  const { isAuthenticated, hasRole } = useAuth(); // Use custom hook for protected routing
  const { isLoggedIn, userData, clearSession } = UseSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      // router.push('http://localhost:3000/Userauthentication/SignIn');
    }
  }, [isLoggedIn]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!currencyCode || !currencyCountry || !currencyIcon) {
      setAlertMessage('Please fill all fields');
      return;
    }

    setButtonText('Processing');
    let dotCount = 0;
    const intervalId = setInterval(() => {
      dotCount = (dotCount + 1) % 4; // Rotate through 0, 1, 2, 3
      setButtonText(`Processing${'.'.repeat(dotCount)}`);
    }, 500); // Update dots every 500ms

    const formData = new FormData();
    formData.append('currency_code', currencyCode.toUpperCase());
    formData.append('currency_country', currencyCountry.toUpperCase());
    formData.append('currency_icon', currencyIcon);

    try {
      const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/currencies/', {
        method: 'POST',
        body: formData,
      });

      clearInterval(intervalId); // Stop the dot animation

      if (res.ok) {
        setAlertMessage('Currency added successfully!');
        setCurrencyCode('');
        setCurrencyCountry('');
        setCurrencyIcon(null);
        setStatusMessage('');
        setErrors({});
        setButtonText('Add');
      } else {
        const errorData = await res.json();
        const errorMessages = Object.values(errorData).flat().join(', ');
        setAlertMessage(`Failed to add currency: ${errorMessages}`);
        setStatusMessage('Failed to add currency.');
        setButtonText('Add');
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage(`An error occurred: ${(error as Error).message}`);
      setStatusMessage('An error occurred.');
      setButtonText('Add');
    }
  }, [currencyCode, currencyCountry, currencyIcon]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000); // 3 seconds delay
    return () => clearTimeout(timer);
  }, []);

  const handleCountryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only letters, numbers, and spaces
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (regex.test(e.target.value)) {
      setCurrencyCountry(e.target.value);
    }
  };

  const handleCurrencyCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only letters and numbers (no spaces or symbols)
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(e.target.value)) {
      setCurrencyCode(e.target.value.toUpperCase()); // Convert to uppercase automatically
    }
  };

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
      {showLoader && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      )}
      <div className={styles.topBar}>
        <button className={styles.topBarButton}>
          <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
        </button>
        <h2 className={styles.topBarTitle}>Add Currency</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Country:</label>
          <input
            type="text"
            value={currencyCountry}
            onChange={handleCountryInputChange}
            required
            className={styles.input}
          />
          {errors.currency_country && <p className={styles.error}>{errors.currency_country}</p>}
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Currency Code:</label>
          <input
            type="text"
            value={currencyCode}
            onChange={handleCurrencyCodeChange}
            required
            className={styles.input}
          />
          {errors.currency_code && <p className={styles.error}>{errors.currency_code}</p>}
        </div>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Upload Icon:</label>
          <input
            type="file"
            onChange={(e) => setCurrencyIcon(e.target.files ? e.target.files[0] : null)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>{buttonText}</button>
      </form>
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

export default AddCurrencyForm;
