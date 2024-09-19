// "use client";
// import React, { useState, useCallback, useEffect } from 'react';
// import { FaArrowLeft } from 'react-icons/fa';
// import { useRouter } from 'next/navigation';
// import styles from './AddBankForm.module.css';
// import dynamic from 'next/dynamic';
// import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

// // Define the IFSC code validation function
// const validateIfscCode = (ifscCode: string): boolean => {
//   const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
//   return ifscPattern.test(ifscCode);
// };

// interface UseAuth {
//   isAuthenticated: boolean;
//   hasRole: (role: string) => boolean;
// }

// const useAuth = (): UseAuth => {
//   const isAuthenticated = true;
//   const hasRole = (role: string) => role === 'admin';
//   return { isAuthenticated, hasRole };
// };

// const AddBankForm: React.FC = () => {
//   const [bankName, setBankName] = useState<string>('');
//   const [accountHolderName, setAccountHolderName] = useState<string>(''); // New field for Account Holder Name
//   const [accountNumber, setAccountNumber] = useState<string>(''); // Account Number
//   const [ifscCode, setIfscCode] = useState<string>(''); // IFSC Code
//   const [branchName, setBranchName] = useState<string>(''); // Branch Name
//   const [swiftBicCode, setSwiftBicCode] = useState<string>(''); // New field for SWIFT/BIC Code
//   const [currency, setCurrency] = useState<string>(''); // New field for Currency
//   const [bankIcon, setBankIcon] = useState<File | null>(null);
//   const [statusMessage, setStatusMessage] = useState<string>('');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [alertMessage, setAlertMessage] = useState<string>('');
//   const [showLoader, setShowLoader] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [dots, setDots] = useState<number>(0); // State for dots animation

//   const router = useRouter();
//   const { isAuthenticated, hasRole } = useAuth();
//   const { isLoggedIn } = UseSession();

//   useEffect(() => {
//     if (isSubmitting) {
//       const interval = setInterval(() => {
//         setDots((prevDots) => (prevDots + 1) % 4); // Cycles through 0 to 3
//       }, 500); // Adjust timing for faster/slower animation
//       return () => clearInterval(interval); // Cleanup interval on unmount or when isSubmitting changes
//     }
//   }, [isSubmitting]);

//   const handleSubmit = useCallback(
//     async (e: React.FormEvent<HTMLFormElement>) => {
//       e.preventDefault();

//       // Validate fields
//       if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !branchName || !swiftBicCode || !currency || !bankIcon) {
//         setErrors({ message: 'Please fill all fields' });
//         return;
//       }

//       // Validate IFSC Code
//       if (!validateIfscCode(ifscCode)) {
//         setErrors({ ifscCode: 'Invalid IFSC Code' });
//         return;
//       }

//       setIsSubmitting(true);  // Set isSubmitting to true when form submission starts

//       const formData = new FormData();
//       formData.append('bank_name', bankName);
//       formData.append('account_holder_name', accountHolderName); // Append new data
//       formData.append('account_number', accountNumber); // Append account number
//       formData.append('ifsc_code', ifscCode); // Append IFSC code
//       formData.append('branch_name', branchName); // Append branch name
//       formData.append('swift_bic_code', swiftBicCode); // Append new data
//       formData.append('currency', currency); // Append new data
//       formData.append('bank_icon', bankIcon);

//       try {
//         const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/fiatmanagementapi/banks/', {
//           method: 'POST',
//           body: formData,
//         });

//         if (res.ok) {
//           setAlertMessage('Bank added successfully!');
//           setBankName('');
//           setAccountHolderName(''); // Reset Account Holder Name
//           setAccountNumber(''); // Reset Account Number
//           setIfscCode(''); // Reset IFSC Code
//           setBranchName(''); // Reset Branch Name
//           setSwiftBicCode(''); // Reset SWIFT/BIC Code
//           setCurrency(''); // Reset Currency
//           setBankIcon(null);
//           setStatusMessage('');
//           setErrors({});
//         } else {
//           const errorData = await res.json();
//           const errorMessages = Object.values(errorData).flat().join(', ');
//           setAlertMessage(`Failed to add bank: ${errorMessages}`);
//           setStatusMessage('Failed to add bank.');
//         }
//       } catch (error: any) {
//         console.error('Error:', error);
//         setAlertMessage(`An error occurred: ${error.message}`);
//         setStatusMessage('An error occurred.');
//       } finally {
//         setIsSubmitting(false);  // Reset isSubmitting after form submission is completed
//       }
//     },
//     [bankName, accountHolderName, accountNumber, ifscCode, branchName, swiftBicCode, currency, bankIcon, router]
//   );

//   const handleLeftArrowClick = useCallback(() => {
//     setShowLoader(true);
//     setTimeout(() => {
//       window.location.href = '/Userauthorization/Dashboard';
//       setShowLoader(false); 
//     }, 1000); 
//   }, []);

//   const handleCloseAlert = useCallback(() => {
//     setAlertMessage('');
//   }, []);

//   if (!isAuthenticated || !hasRole('admin')) {
//     return <p>You are not authorized to access this page.</p>;
//   }

//   return (
//     <div className={styles.container}>
//       {alertMessage && (
//         <div className={styles.customAlert}>
//           <p>{alertMessage}</p>
//           <button onClick={handleCloseAlert} className={styles.closeButton}>OK</button>
//         </div>
//       )}
        
//       <div className={styles.topBar}>
//         {showLoader && (
//           <div className={styles.loaderContainer}>
//             <div className={styles.loader}></div>
//           </div>
//         )}
//         <button className={styles.topBarButton}>
//           <FaArrowLeft className={styles.topBarIcon} onClick={handleLeftArrowClick}/>
//         </button>
//         <h2 className={styles.topBarTitle}>Add Bank</h2>
//       </div>

//       <form onSubmit={handleSubmit} className={styles.form}>
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>Bank Name:</label>
//           <input
//             type="text"
//             value={bankName}
//             onChange={(e) => setBankName(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* Account Holder Name Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>Account Holder Name:</label>
//           <input
//             type="text"
//             value={accountHolderName}
//             onChange={(e) => setAccountHolderName(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* Account Number Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>Account Number:</label>
//           <input
//             type="number"
//             value={accountNumber}
//             onChange={(e) => setAccountNumber(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* IFSC Code Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>IFSC Code:</label>
//           <input
//             type="text"
//             value={ifscCode}
//             onChange={(e) => setIfscCode(e.target.value)}
//             required
//             className={styles.input}
//           />
//           {errors.ifscCode && <p className={styles.errorMessage}>{errors.ifscCode}</p>}
//         </div>

//         {/* Branch Name Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>Branch Name:</label>
//           <input
//             type="text"
//             value={branchName}
//             onChange={(e) => setBranchName(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* SWIFT/BIC Code Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>SWIFT/BIC Code:</label>
//           <input
//             type="text"
//             value={swiftBicCode}
//             onChange={(e) => setSwiftBicCode(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* Currency Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>Currency:</label>
//           <input
//             type="text"
//             value={currency}
//             onChange={(e) => setCurrency(e.target.value)}
//             required
//             className={styles.input}
//           />
//         </div>

//         {/* Upload Icon Field */}
//         <div className={styles.fieldContainer}>
//           <label className={styles.label}>KYC/Verification Document Upload :</label>
//           <input
//             type="file"
//             onChange={(e) => setBankIcon(e.target.files ? e.target.files[0] : null)}
//             required
//             className={styles.input}
//           />
//         </div>

//         <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
//           {isSubmitting ? `Processing${'.'.repeat(dots)}` : 'Add'}
//         </button>
//       </form>
//       {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}
//     </div>
//   );
// };

// export default dynamic(() => Promise.resolve(AddBankForm), { ssr: false });


"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import styles from './AddBankForm.module.css';
import dynamic from 'next/dynamic';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

// Define the IFSC code validation function
const validateIfscCode = (ifscCode: string): boolean => {
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscPattern.test(ifscCode);
};

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
  const [accountHolderName, setAccountHolderName] = useState<string>(''); // New field for Account Holder Name
  const [accountNumber, setAccountNumber] = useState<string>(''); // Account Number
  const [ifscCode, setIfscCode] = useState<string>(''); // IFSC Code
  const [branchName, setBranchName] = useState<string>(''); // Branch Name
  const [swiftBicCode, setSwiftBicCode] = useState<string>(''); // New field for SWIFT/BIC Code
  const [currency, setCurrency] = useState<string>(''); // New field for Currency
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

      // Validate fields
      if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !branchName || !swiftBicCode || !currency || !bankIcon) {
        setErrors({ message: 'Please fill all fields' });
        return;
      }

      // Validate IFSC Code
      if (!validateIfscCode(ifscCode)) {
        setErrors({ ifscCode: 'Invalid IFSC Code' });
        return;
      }

      setIsSubmitting(true);  // Set isSubmitting to true when form submission starts

      const formData = new FormData();
      formData.append('bank_name', bankName);
      formData.append('account_holder_name', accountHolderName); // Append new data
      formData.append('account_number', accountNumber); // Append account number
      formData.append('ifsc_code', ifscCode); // Append IFSC code
      formData.append('branch_name', branchName); // Append branch name
      formData.append('bic_code', swiftBicCode); // Append new data
      formData.append('currency', currency); // Append new data
      formData.append('kyc_document', bankIcon);

      try {
        const res = await fetch('http://127.0.0.1:8000/addbank/add/', { // Updated URL
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          setAlertMessage('Bank added successfully!');
          setBankName('');
          setAccountHolderName(''); // Reset Account Holder Name
          setAccountNumber(''); // Reset Account Number
          setIfscCode(''); // Reset IFSC Code
          setBranchName(''); // Reset Branch Name
          setSwiftBicCode(''); // Reset SWIFT/BIC Code
          setCurrency(''); // Reset Currency
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
    [bankName, accountHolderName, accountNumber, ifscCode, branchName, swiftBicCode, currency, bankIcon, router]
  );

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
        </div>

        {/* Account Holder Name Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Account Holder Name:</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Account Number Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Account Number:</label>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* IFSC Code Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>IFSC Code:</label>
          <input
            type="text"
            value={ifscCode}
            onChange={(e) => setIfscCode(e.target.value)}
            required
            className={styles.input}
          />
          {errors.ifscCode && <p className={styles.errorMessage}>{errors.ifscCode}</p>}
        </div>

        {/* Branch Name Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Branch Name:</label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* SWIFT/BIC Code Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>SWIFT/BIC Code:</label>
          <input
            type="text"
            value={swiftBicCode}
            onChange={(e) => setSwiftBicCode(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Currency Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>Currency:</label>
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Upload Icon Field */}
        <div className={styles.fieldContainer}>
          <label className={styles.label}>KYC/Verification Document Upload :</label>
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
