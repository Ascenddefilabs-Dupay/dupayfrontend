import { useState, useCallback } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './AddBankForm.module.css'
import dynamic from 'next/dynamic';

// Authentication and role-based access hook (included in the same file)
const useAuth = () => {
  const isAuthenticated = true; // Replace with actual authentication logic
  const hasRole = (role) => role === 'admin'; // Replace with actual role checking logic
  return { isAuthenticated, hasRole };
};

const AddBankForm = () => {
  const [bankName, setBankName] = useState('');
  const [bankIcon, setBankIcon] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState('');
  const { isAuthenticated, hasRole } = useAuth(); // Use custom hook for protected routing
  

  const handleSubmit = useCallback(
    async (e) => {
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
          // setErrors(errorData);

          
          const errorMessages = Object.values(errorData).flat().join(', ');
          setAlertMessage(`Failed to add bank: ${errorMessages}`);
          setStatusMessage('Failed to add bank.');
        }
      } catch (error) {
        console.error('Error:', error);
        setAlertMessage(`An error occurred: ${error.message}`);
        setStatusMessage('An error occurred.');
      }
    },
    [bankName, bankIcon, router]
  );

  const handleLeftArrowClick = useCallback(() => {
      window.location.href = '/Userauthorization/Dashboard';
  }, [router]);

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
            onChange={(e) => setBankIcon(e.target.files[0])}
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
export default dynamic(() => Promise.resolve(AddBankForm), { ssr: false });