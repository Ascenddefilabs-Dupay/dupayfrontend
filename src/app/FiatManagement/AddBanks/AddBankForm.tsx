"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './AddBankForm.module.css';

// Define the IFSC code validation function
const validateIfscCode = (ifscCode: string): boolean => {
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscPattern.test(ifscCode);
};

const AddBankForm: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [bankName, setBankName] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [swiftBicCode, setSwiftBicCode] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [bankIcon, setBankIcon] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  // Fetch user_id from localStorage when component mounts
  useEffect(() => {
    const storedSessionData = localStorage.getItem('session_data');
    
    if (storedSessionData) {
      try {
        const userData = JSON.parse(storedSessionData);
        const userId = userData?.user_id;
        if (userId) {
          setUserId(userId);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      // Validate fields
      if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !branchName || !swiftBicCode || !currency || !bankIcon) {
        setStatusMessage('Please fill all fields');
        return;
      }
  
      // Validate IFSC Code
      if (!validateIfscCode(ifscCode)) {
        setStatusMessage('Invalid IFSC Code');
        return;
      }
  
      setIsSubmitting(true);
  
      const formData = new FormData();
      formData.append('user_id', userId !== null ? userId.toString() : '');
      formData.append('bank_name', bankName);
      formData.append('account_holder_name', accountHolderName);
      formData.append('account_number', accountNumber);
      formData.append('ifsc_code', ifscCode);
      formData.append('branch_name', branchName);
      formData.append('bic_code', swiftBicCode);
      formData.append('currency', currency);
      formData.append('kyc_document', bankIcon);
  
      try {
        const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/addbank/add/', {
          method: 'POST',
          body: formData,
        });
  
        if (res.ok) {
          setAlertMessage('Bank added successfully!');
          
          // Clear all form fields after successful submission
          setBankName('');
          setAccountHolderName('');
          setAccountNumber('');
          setIfscCode('');
          setBranchName('');
          setSwiftBicCode('');
          setCurrency('');
          setBankIcon(null);
          setStatusMessage('');
        } else {
          const errorData = await res.json();
          setAlertMessage('Failed to add bank.');
        }
      } catch (error: any) {
        setAlertMessage('An error occurred while submitting.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [bankName, accountHolderName, accountNumber, ifscCode, branchName, swiftBicCode, currency, bankIcon, userId]
  );
  
  const handleLeftArrowClick = useCallback(() => {
    setShowLoader(true);
    setTimeout(() => {
      window.location.href = '/Userauthorization/Dashboard/Home';
      setShowLoader(false);
    }, 1000);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setAlertMessage('');
  }, []);

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
          <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick} />
        </button>
        <h2 className={styles.topBarTitle}>Add Bank</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Bank Name<span className={styles.required}>*</span></label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>Account Holder Name<span className={styles.required}>*</span></label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>Account Number<span className={styles.required}>*</span></label>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>IFSC Code <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>Branch Name<span className={styles.required}>*</span></label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>SWIFT/BIC Code<span className={styles.required}>*</span></label>
          <input
            type="text"
            value={swiftBicCode}
            onChange={(e) => setSwiftBicCode(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>Currency<span className={styles.required}>*</span></label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.fieldContainer}>
          <label className={styles.label}>KYC/Bank Icon<span className={styles.required}>*</span></label>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setBankIcon(e.target.files[0]);
              }
            }}
            required
            className={styles.fileInput}
          />
        </div>

        {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
        <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default AddBankForm;
