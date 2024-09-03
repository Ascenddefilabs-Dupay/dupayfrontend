// 'use client';

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './PersonalDetailsForm.module.css';

// const PersonalDetailsForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     mobileNumber: '',
//     dob: '',
//     addressLine1: '',
//     addressLine2: '',
//     state: '',
//     city: '',
//     postalCode: '',
//     country: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const validateField = (name, value) => {
//     let error = '';
//     switch (name) {
//       case 'firstName':
//         if (!value) error = 'First Name is required';
//         break;
//       case 'lastName':
//         if (!value) error = 'Last Name is required';
//         break;
//       case 'mobileNumber':
//         if (!value) error = 'Mobile Number is required';
//         else if (!/^\d{10}$/.test(value)) error = 'Mobile Number is invalid';
//         break;
//         case 'dob':
//           if (!value) {
//             error = 'Date of Birth is required';
//           } else {
//             const today = new Date();
//             const birthDate = new Date(value);
//             let age = today.getFullYear() - birthDate.getFullYear();
//             const monthDiff = today.getMonth() - birthDate.getMonth();
//             if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//               age--;
//             }
//             if (age < 18) {
//               error = 'You must be at least 18 years old.';
//             }
//           }
//           break;
//       case 'addressLine1':
//         if (!value) error = 'Address Line 1 is required';
//         break;
//       case 'state':
//         if (!value) error = 'State/Region is required';
//         break;
//       case 'city':
//         if (!value) error = 'City is required';
//         break;
//       case 'postalCode':
//         if (!value) error = 'Postal/Zip Code is required';
//         break;
//       case 'country':
//         if (!value) error = 'Country is required';
//         break;
//       default:
//         break;
//     }
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     validateField(name, value);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     Object.keys(formData).forEach((key) => {
//       validateField(key, formData[key]);
//       if (errors[key]) {
//         newErrors[key] = errors[key];
//       }
//     });
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//         try {
//             const response = await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/api/personal-details/', {
//                 first_name: formData.firstName,
//                 last_name: formData.lastName,
//                 mobile_number: formData.mobileNumber,
//                 dob: formData.dob,
//                 address_line1: formData.addressLine1,
//                 address_line2: formData.addressLine2,
//                 state: formData.state,
//                 city: formData.city,
//                 postal_code: formData.postalCode,
//                 country: formData.country
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             setMessage('Personal details submitted successfully!');
//             setFormData({
//                 firstName: '',
//                 lastName: '',
//                 mobileNumber: '',
//                 dob: '',
//                 addressLine1: '',
//                 addressLine2: '',
//                 state: '',
//                 city: '',
//                 postalCode: '',
//                 country: ''
//             });
//             setTimeout(() => {
//                 // router.push('/KycVerification/TransakForm');
//                 window.location.href = 'http://localhost:3002/WalletManagement/WalletCreation';
//             }, 2000);  // Added a delay to ensure the message is visible before redirect
//         } catch (error) {
//             console.error('Error submitting personal details:', error);
//             setMessage('Error submitting personal details. Please try again.');
//         }
//     }
// };

//   return (
//     <div className={styles.formContainer}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h2 className={styles.heading}>Personal Details</h2>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             First Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Last Name <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Mobile Number <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="mobileNumber"
//             value={formData.mobileNumber}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.mobileNumber && <p className={styles.error}>{errors.mobileNumber}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Date of Birth <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.dob && <p className={styles.error}>{errors.dob}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Address Line 1 <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="addressLine1"
//             value={formData.addressLine1}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>Address Line 2 (optional)</label>
//           <input
//             type="text"
//             name="addressLine2"
//             value={formData.addressLine2}
//             onChange={handleChange}
//             className={styles.input}
//           />
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             State/Region <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="state"
//             value={formData.state}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.state && <p className={styles.error}>{errors.state}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             City <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="city"
//             value={formData.city}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.city && <p className={styles.error}>{errors.city}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Postal/Zip Code <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="postalCode"
//             value={formData.postalCode}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.postalCode && <p className={styles.error}>{errors.postalCode}</p>}
//         </div>
//         <div className={styles.formGroup}>
//           <label className={styles.label}>
//             Country <span className={styles.required}>*</span>
//           </label>
//           <input
//             type="text"
//             name="country"
//             value={formData.country}
//             onChange={handleChange}
//             className={styles.input}
//             required
//           />
//           {errors.country && <p className={styles.error}>{errors.country}</p>}
//         </div>
//         <button type="submit" className={styles.submitButton}>Submit</button>
//         {message && <p className={styles.message}>{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default PersonalDetailsForm;

'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './PersonalDetailsForm.module.css';
import UseSession from '@/app/Userauthentication/SignIn/hooks/UseSession';

const CustomAlert = ({ message, onClose }) => (
  <div className={styles.customAlert}>
    <p>{message}</p>
    <button onClick={onClose} className={styles.closeButton}>Ok</button>
  </div>
);
const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    dob: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isLoggedIn, userData } = UseSession();

  React.useEffect(() => {
    if (isLoggedIn) {
      console.log('User ID:', userData?.user_id);
    } else {
      console.log('User is not logged in');
    }
  }, [isLoggedIn, userData]);

  const validateField = useCallback((name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value) error = 'First Name is required';
        break;
      case 'lastName':
        if (!value) error = 'Last Name is required';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile Number is required';
        else if (!/^\d{10}$/.test(value)) error = 'Mobile Number is invalid';
        break;
      case 'dob':
        if (!value) {
          error = 'Date of Birth is required';
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) {
            error = 'You must be at least 18 years old.';
          }
        }
        break;
      case 'addressLine1':
        if (!value) error = 'Address Line 1 is required';
        break;
      case 'state':
        if (!value) error = 'State/Region is required';
        break;
      case 'city':
        if (!value) error = 'City is required';
        break;
      case 'postalCode':
        if (!value) error = 'Postal/Zip Code is required';
        break;
      case 'country':
        if (!value) error = 'Country is required';
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    validateField(name, value);
  };
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (errors[key]) {
        newErrors[key] = errors[key];
      }
    });
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/kycverification_api/personal-details/', {
          user_id: userData?.user_id, // Include user_id
          first_name: formData.firstName,
          last_name: formData.lastName,
          mobile_number: formData.mobileNumber,
          dob: formData.dob,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          state: formData.state,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setMessage('Personal details submitted successfully!');
        setShowAlert(true);
        setRedirect(true);
        setFormData({
          firstName: '',
          lastName: '',
          mobileNumber: '',
          dob: '',
          addressLine1: '',
          addressLine2: '',
          state: '',
          city: '',
          postalCode: '',
          country: ''
        });
      } catch (error) {
        console.error('Error submitting personal details:', error);
        setMessage('Error submitting personal details. Please try again.');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    }
  };
  const closeAlert = () => {
    setShowAlert(false);
    if (redirect) {
      router.push('/WalletManagement/WalletCreation');
    }
  };
  return (
    <div className={styles.formContainer}>
      {showAlert && <CustomAlert message={message} onClose={closeAlert} />}
      <form onSubmit={handleSubmit} className={styles.form}>
        {loading && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
        <h2 className={styles.heading}>Personal Details</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            First Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Last Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Mobile Number <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.mobileNumber && <p className={styles.error}>{errors.mobileNumber}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Date of Birth <span className={styles.required}>*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.dob && <p className={styles.error}>{errors.dob}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Address Line 1 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.addressLine1 && <p className={styles.error}>{errors.addressLine1}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Address Line 2 (optional)</label>
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            State/Region <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.state && <p className={styles.error}>{errors.state}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            City <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.city && <p className={styles.error}>{errors.city}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Postal/Zip Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.postalCode && <p className={styles.error}>{errors.postalCode}</p>}
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Country <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={styles.input}
            required
          />
          {errors.country && <p className={styles.error}>{errors.country}</p>}
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};
export default PersonalDetailsForm;
