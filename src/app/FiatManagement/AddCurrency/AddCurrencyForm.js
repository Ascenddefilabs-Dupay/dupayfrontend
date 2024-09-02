import { useState, useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './AddCurrencyForm.module.css';

// Authentication and role-based access hook (included in the same file)
const useAuth = () => {
  const isAuthenticated = true; // Replace with actual authentication logic
  const hasRole = (role) => role === 'admin'; // Replace with actual role checking logic
  return { isAuthenticated, hasRole };
};

const AddCurrencyForm = () => {
  const [currencyCode, setCurrencyCode] = useState('');
  const [currencyCountry, setCurrencyCountry] = useState('');
  const [currencyIcon, setCurrencyIcon] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const { isAuthenticated, hasRole } = useAuth(); // Use custom hook for protected routing

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!currencyCode || !currencyCountry || !currencyIcon) {
      setAlertMessage('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('currency_code', currencyCode.toUpperCase());
    formData.append('currency_country', currencyCountry.toUpperCase());
    formData.append('currency_icon', currencyIcon);

    try {
      const res = await fetch('https://fiatmanagement-rcfpsxcera-uc.a.run.app/fiatmanagementapi/currencies/', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setAlertMessage('Currency added successfully!');
        setCurrencyCode('');
        setCurrencyCountry('');
        setCurrencyIcon(null);
        setStatusMessage('');
        setErrors({});
      } else {
        const errorData = await res.json();
        const errorMessages = Object.values(errorData).flat().join(', ');
        setAlertMessage(`Failed to add currency: ${errorMessages}`);
        setStatusMessage('Failed to add currency.');
      }
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage(`An error occurred: ${error.message}`);
      setStatusMessage('An error occurred.');
    }
  }, [currencyCode, currencyCountry, currencyIcon]);

  const handleCountryInputChange = (e) => {
    // Allow only letters, numbers, and spaces
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (regex.test(e.target.value)) {
      setCurrencyCountry(e.target.value);
    }
  };

  const handleCurrencyCodeChange = (e) => {
    // Allow only letters and numbers (no spaces or symbols)
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(e.target.value)) {
      setCurrencyCode(e.target.value.toUpperCase()); // Convert to uppercase automatically
    }
  };

  const handleLeftArrowClick = useCallback(() => {
    window.location.href = '/Userauthorization/Dashboard';
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
        <button className={styles.topBarButton}>
          <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick}/>
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
            onChange={(e) => setCurrencyIcon(e.target.files[0])}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Add</button>
      </form>
      {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
}

export default AddCurrencyForm;