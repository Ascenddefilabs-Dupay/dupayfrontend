// 'use client'

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './PanForm.module.css';
// import ProgressBar from '../kycform1/ProgressBar';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const PanForm = () => {
//   const [panNumber, setPanNumber] = useState('');
//   const [panFrontImage, setPanFrontImage] = useState(null);
//   const [panFrontImageUrl, setPanFrontImageUrl] = useState(null);
//   const [panBackImage, setPanBackImage] = useState(null);
//   const [panBackImageUrl, setPanBackImageUrl] = useState(null);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [imageError, setImageError] = useState('');
//   const router = useRouter();

//   const panNumberRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!panNumber || !panNumberRegex.test(panNumber)) {
//       setError('Invalid PAN Number format.');
//       return;
//     }

//     if (
//       (panFrontImage && panFrontImage.size > 2 * 1024 * 1024) ||
//       (panBackImage && panBackImage.size > 2 * 1024 * 1024)
//     ) {
//       setImageError('Image size should be within 2MB.');
//       return;
//     }

//     setError('');
//     setImageError('');

//     const formData = new FormData();
//     formData.append('document_number2', panNumber);

//     if (panFrontImage) {
//       formData.append('document_front_image2', panFrontImage);
//     }

//     if (panBackImage) {
//       formData.append('document_back_image2', panBackImage);
//     }

//     try {
//       const response = await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/api/kyc-details/', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setMessage('PAN submitted successfully!');
//       setPanNumber('');
//       setPanFrontImage(null);
//       setPanFrontImageUrl(null);
//       setPanBackImage(null);
//       setPanBackImageUrl(null);

//       setTimeout(() => {
//         router.push('/KycVerification/KycMessage');
//       });

//     } catch (error) {
//       console.error('Error submitting PAN:', error);
//       setMessage('Error submitting PAN. Please try again.');
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

//   const handlePanNumberChange = (e) => {
//     const value = e.target.value.toUpperCase();
//     if (value.length <= 10) {
//       setPanNumber(value);
//     }
//   };

//   const handleBackClick = () => {
//     router.push('/KycVerification/AdharVerification'); // Adjust the path as needed
// };


//   return (
//     <div className={styles.formContainer}>
//       <div className={styles.card}>
//         <ArrowBackIcon className={styles.setting_back_icon} onClick={handleBackClick} />
//         <form onSubmit={handleSubmit} className={styles.form}>
//           <h2 className={styles.heading}>PAN Verification</h2>
//           <ProgressBar step={2} totalSteps={3} />
//           <div className={styles.formGroup}>
//             <label htmlFor="pan-number" className={styles.label}>
//               PAN Number:
//             </label>
//             <input
//               type="text"
//               id="pan-number"
//               name="pan-number"
//               placeholder="Enter PAN Number"
//               className={styles.input}
//               value={panNumber}
//               onChange={handlePanNumberChange}
//               required
//             />
//           </div>
//           {error && <p className={styles.error}>{error}</p>}
//           <div className={styles.formGroup}>
//             <label htmlFor="pan-front-image" className={styles.label}>
//               Upload PAN Front Image:
//             </label>
//             <div className={styles.uploadContainer}>
//               <input
//                 type="file"
//                 id="pan-front-image"
//                 name="pan-front-image"
//                 accept="image/*"
//                 className={styles.inputFile}
//                 onChange={(e) => handleImageChange(e, setPanFrontImage, setPanFrontImageUrl)}
//                 required
//               />
//               {panFrontImageUrl && (
//                 <img src={panFrontImageUrl} alt="PAN Front Preview" className={styles.uploadedImage} />
//               )}
//             </div>
//           </div>
//           <div className={styles.formGroup}>
//             <label htmlFor="pan-back-image" className={styles.label}>
//               Upload PAN Back Image:
//             </label>
//             <div className={styles.uploadContainer}>
//               <input
//                 type="file"
//                 id="pan-back-image"
//                 name="pan-back-image"
//                 accept="image/*"
//                 className={styles.inputFile}
//                 onChange={(e) => handleImageChange(e, setPanBackImage, setPanBackImageUrl)}
//                 required
//               />
//               {panBackImageUrl && (
//                 <img src={panBackImageUrl} alt="PAN Back Preview" className={styles.uploadedImage} />
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

// export default PanForm;




'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './PanForm.module.css';
import ProgressBar from '../kycform1/ProgressBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PanForm = () => {
  const [panNumber, setPanNumber] = useState('');
  const [panFrontImage, setPanFrontImage] = useState(null);
  const [panFrontImageUrl, setPanFrontImageUrl] = useState(null);
  const [panBackImage, setPanBackImage] = useState(null);
  const [panBackImageUrl, setPanBackImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const panNumberRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!panNumber || !panNumberRegex.test(panNumber)) {
      setError('Invalid PAN Number format.');
      return;
    }

    if (
      (panFrontImage && panFrontImage.size > 2 * 1024 * 1024) ||
      (panBackImage && panBackImage.size > 2 * 1024 * 1024)
    ) {
      setImageError('Image size should be within 2MB.');
      return;
    }

    setError('');
    setImageError('');

    const formData = new FormData();
    formData.append('document_number2', panNumber);

    if (panFrontImage) {
      formData.append('document_front_image2', panFrontImage);
    }

    if (panBackImage) {
      formData.append('document_back_image2', panBackImage);
    }

    try {
      const response = await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/api/kyc-details/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAlertMessage('PAN submitted successfully!');
      setShowAlert(true);
      setTimeout(() => {
        setAlertMessage('');
        setShowAlert(false);
        router.push('/KycVerification/KycMessage');
      }, 3000); // Hide alert after 3 seconds

      setPanNumber('');
      setPanFrontImage(null);
      setPanFrontImageUrl(null);
      setPanBackImage(null);
      setPanBackImageUrl(null);

    } catch (error) {
      console.error('Error submitting PAN:', error);
      setAlertMessage('Error submitting PAN. Please try again.');
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

  const handlePanNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 10) {
      setPanNumber(value);
    }
  };

  const handleBackClick = () => {
    router.push('/KycVerification/AdharVerification'); // Adjust the path as needed
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.card}>
        <ArrowBackIcon className={styles.setting_back_icon} onClick={handleBackClick} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.heading}>PAN Verification</h2>
          <ProgressBar step={2} totalSteps={3} />
          <div className={styles.formGroup}>
            <label htmlFor="pan-number" className={styles.label}>
              PAN Number:
            </label>
            <input
              type="text"
              id="pan-number"
              name="pan-number"
              placeholder="Enter PAN Number"
              className={styles.input}
              value={panNumber}
              onChange={handlePanNumberChange}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formGroup}>
            <label htmlFor="pan-front-image" className={styles.label}>
              Upload PAN Front Image:
            </label>
            <div className={styles.uploadContainer}>
              <input
                type="file"
                id="pan-front-image"
                name="pan-front-image"
                accept="image/*"
                className={styles.inputFile}
                onChange={(e) => handleImageChange(e, setPanFrontImage, setPanFrontImageUrl)}
                required
              />
              {panFrontImageUrl && (
                <img src={panFrontImageUrl} alt="PAN Front Preview" className={styles.uploadedImage} />
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="pan-back-image" className={styles.label}>
              Upload PAN Back Image:
            </label>
            <div className={styles.uploadContainer}>
              <input
                type="file"
                id="pan-back-image"
                name="pan-back-image"
                accept="image/*"
                className={styles.inputFile}
                onChange={(e) => handleImageChange(e, setPanBackImage, setPanBackImageUrl)}
                required
              />
              {panBackImageUrl && (
                <img src={panBackImageUrl} alt="PAN Back Preview" className={styles.uploadedImage} />
              )}
            </div>
          </div>
          {imageError && <p className={styles.error}>{imageError}</p>}
          <button type="submit" className={styles.submitButton} disabled={imageError !== ''}>
            Submit
          </button>
        </form>
        {showAlert && (
          <div className={styles.customAlert}>
            <p>{alertMessage}</p>
            <button className={styles.closeButton} onClick={() => setShowAlert(false)}>Ok</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanForm;
