// 'use client'

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './AadharForm.module.css';
// import ProgressBar from '../kycform1/ProgressBar';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const AadharForm = () => {
//   const [aadharNumber, setAadharNumber] = useState('');
//   const [aadharFrontImage, setAadharFrontImage] = useState(null);
//   const [aadharFrontImageUrl, setAadharFrontImageUrl] = useState(null);
//   const [aadharBackImage, setAadharBackImage] = useState(null);
//   const [aadharBackImageUrl, setAadharBackImageUrl] = useState(null);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [imageError, setImageError] = useState('');
//   const router = useRouter();

//   const aadharNumberRegex = /^[0-9 ]{14}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!aadharNumber || !aadharNumberRegex.test(aadharNumber)) {
//       setError('Invalid Aadhar Number format.');
//       return;
//     }

//     if (
//       (aadharFrontImage && aadharFrontImage.size > 2 * 1024 * 1024) ||
//       (aadharBackImage && aadharBackImage.size > 2 * 1024 * 1024)
//     ) {
//       setImageError('Image size should be within 2MB.');
//       return;
//     }

//     setError('');
//     setImageError('');

//     const formData = new FormData();
//     formData.append('document_number1', aadharNumber.replace(/ /g, ''));

//     if (aadharFrontImage) {
//       formData.append('document_front_image1', aadharFrontImage);
//     }

//     if (aadharBackImage) {
//       formData.append('document_back_image1', aadharBackImage);
//     }

//     try {
//       const response = await axios.post('https://kycverification-ind-255574993735.asia-south1.run.app/api/kyc-details/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setMessage('Aadhar submitted successfully!');
//       setAadharNumber('');
//       setAadharFrontImage(null);
//       setAadharFrontImageUrl(null);
//       setAadharBackImage(null);
//       setAadharBackImageUrl(null);

//       setTimeout(() => {
//         router.push('/KycVerification/PanVerification');
//       });

//     } catch (error) {
//       console.error('Error submitting Aadhar:', error);
//       setMessage('Error submitting Aadhar. Please try again.');
//     }
//   };

//   const handleImageChange = (e, setImage, setImageUrl) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         setImageError('Image size should be within 2MB.');
//         setImage(null);
//         setImageUrl(null);
//       } else {
//         setImageError('');
//         setImage(file);
//         setImageUrl(URL.createObjectURL(file));
//       }
//     }
//   };

//   const handleAadharNumberChange = (e) => {
//     const value = e.target.value.replace(/\s/g, '');
//     if (value.length <= 12) {
//       const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
//       setAadharNumber(formattedValue);
//     }
//   };

//   const handleBackClick = () => {
//     router.push('/KycVerification/kycform1'); // Adjust the path as needed
// };

//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.card}>
//         {/* Back Arrow */}
//         <ArrowBackIcon className={styles.setting_back_icon} onClick={handleBackClick} />
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <h2 className={styles.heading}>Aadhar Verification</h2>
//           <ProgressBar step={2} totalSteps={3} />
//           <div className={styles.formGroup}>
//             <label htmlFor="aadhar-number" className={styles.label}>
//               Aadhar Number:
//             </label>
//             <input
//               type="text"
//               id="aadhar-number"
//               name="aadhar-number"
//               placeholder="Enter Aadhar Number"
//               className={styles.input}
//               value={aadharNumber}
//               onChange={handleAadharNumberChange}
//               required
//             />
//           </div>
//           {error && <p className={styles.error}>{error}</p>}
//           <div className={styles.formGroup}>
//             <label htmlFor="aadhar-front-image" className={styles.label}>
//               Upload Aadhar Front Image:
//             </label>
//             <div className={styles.uploadContainer}>
//               <input
//                 type="file"
//                 id="aadhar-front-image"
//                 name="aadhar-front-image"
//                 accept="image/*"
//                 className={styles.inputFile}
//                 onChange={(e) => handleImageChange(e, setAadharFrontImage, setAadharFrontImageUrl)}
//                 required
//               />
//               {aadharFrontImageUrl && (
//                 <img src={aadharFrontImageUrl} alt="Aadhar Front Preview" className={styles.uploadedImage} />
//               )}
//             </div>
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="aadhar-back-image" className={styles.label}>
//               Upload Aadhar Back Image:
//             </label>
//             <div className={styles.uploadContainer}>
//               <input
//                 type="file"
//                 id="aadhar-back-image"
//                 name="aadhar-back-image"
//                 accept="image/*"
//                 className={styles.inputFile}
//                 onChange={(e) => handleImageChange(e, setAadharBackImage, setAadharBackImageUrl)}
//                 required
//               />
//               {aadharBackImageUrl && (
//                 <img src={aadharBackImageUrl} alt="Aadhar Back Preview" className={styles.uploadedImage} />
//               )}
//             </div>
//           </div>
//           {imageError && <p className={styles.error}>{imageError}</p>}
//           <button type="submit" className={styles.submitButton} disabled={imageError !== ''}>
//             Submit
//           </button>
//           {message && <p className={styles.message}>{message}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AadharForm;


'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './AadharForm.module.css';
import ProgressBar from '../kycform1/ProgressBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AadharForm = () => {
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharFrontImage, setAadharFrontImage] = useState(null);
  const [aadharFrontImageUrl, setAadharFrontImageUrl] = useState(null);
  const [aadharBackImage, setAadharBackImage] = useState(null);
  const [aadharBackImageUrl, setAadharBackImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [redirect, setRedirect] = useState(false); // New state for redirect
  const router = useRouter();

  const aadharNumberRegex = /^[0-9 ]{14}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aadharNumber || !aadharNumberRegex.test(aadharNumber)) {
      setError('Invalid Aadhar Number format.');
      return;
    }

    if (
      (aadharFrontImage && aadharFrontImage.size > 2 * 1024 * 1024) ||
      (aadharBackImage && aadharBackImage.size > 2 * 1024 * 1024)
    ) {
      setImageError('Image size should be within 2MB.');
      return;
    }

    setError('');
    setImageError('');

    const formData = new FormData();
    formData.append('document_number1', aadharNumber.replace(/ /g, ''));

    if (aadharFrontImage) {
      formData.append('document_front_image1', aadharFrontImage);
    }

    if (aadharBackImage) {
      formData.append('document_back_image1', aadharBackImage);
    }

    try {
      await axios.post('https://kycverification-ind-255574993735.asia-south1.run.app/kycverification_api/kyc-details/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertMessage('Aadhar submitted successfully!');
      setShowAlert(true);
      setRedirect(true); // Trigger redirect state
      setAadharNumber('');
      setAadharFrontImage(null);
      setAadharFrontImageUrl(null);
      setAadharBackImage(null);
      setAadharBackImageUrl(null);
    } catch (error) {
      console.error('Error submitting Aadhar:', error);
      setAlertMessage('Error submitting Aadhar. Please try again.');
      
      setShowAlert(true);
    }
  };

  const handleImageChange = (e, setImage, setImageUrl) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Image size should be within 2MB.');
        setImage(null);
        setImageUrl(null);
      } else {
        setImageError('');
        setImage(file);
        setImageUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleAadharNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 12) {
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      setAadharNumber(formattedValue);
    }
  };

  const handleBackClick = () => {
    router.push('/KycVerification/kycform1');
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    if (redirect) {
      router.push('/KycVerification/PanVerification');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.card}>
        {/* Back Arrow */}
        <ArrowBackIcon className={styles.setting_back_icon} onClick={handleBackClick} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.heading}>Aadhar Verification</h2>
          <ProgressBar step={2} totalSteps={3} />
          <div className={styles.formGroup}>
            <label htmlFor="aadhar-number" className={styles.label}>
              Aadhar Number:
            </label>
            <input
              type="text"
              id="aadhar-number"
              name="aadhar-number"
              placeholder="Enter Aadhar Number"
              className={styles.input}
              value={aadharNumber}
              onChange={handleAadharNumberChange}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="aadhar-front-image" className={styles.label}>
              Upload Aadhar Front Image:
            </label>
            <div className={styles.uploadContainer}>
              <input
                type="file"
                id="aadhar-front-image"
                name="aadhar-front-image"
                accept="image/*"
                className={styles.inputFile}
                onChange={(e) => handleImageChange(e, setAadharFrontImage, setAadharFrontImageUrl)}
                required

              />
              {aadharFrontImageUrl && (
                <img src={aadharFrontImageUrl} alt="Aadhar Front Preview" className={styles.uploadedImage} />
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="aadhar-back-image" className={styles.label}>
              Upload Aadhar Back Image:
            </label>
            <div className={styles.uploadContainer}>
              <input
                type="file"
                id="aadhar-back-image"
                name="aadhar-back-image"
                accept="image/*"
                className={styles.inputFile}
                onChange={(e) => handleImageChange(e, setAadharBackImage, setAadharBackImageUrl)}
                required
              />
              {aadharBackImageUrl && (
                <img src={aadharBackImageUrl} alt="Aadhar Back Preview" className={styles.uploadedImage} />
              )}
            </div>
          </div>
          {imageError && <p className={styles.error}>{imageError}</p>}
          <button type="submit" className={styles.submitButton} disabled={imageError !== ''}>
            Submit
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
      {/* Custom alert box */}
      {showAlert && (
        <div className={styles.customAlert}>
          <p>{alertMessage}</p>
          <button className={styles.closeButton} onClick={handleCloseAlert}>Ok</button>
        </div>
      )}
    </div>
  );
};

export default AadharForm;
