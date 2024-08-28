// 'use client'
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import styles from './DocumentForm.module.css';
// import ProgressBar from './ProgressBar';

// const countries = [
//     'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan', 'China', 'Brazil',
// ];

// const documentOptions = {
//     India: ['Government ID'],
//     Default: ['Passport']
// };

// const DocumentForm = () => {
//     const [country_name, setCountryName] = useState(countries[0]); // Updated variable name
//     const [documentType, setDocumentType] = useState('');
//     const router = useRouter();

//     useEffect(() => {
//         if (documentType) {
//             const handleSaveAndRedirect = async () => {
//                 const data = { country_name, document_type: documentType }; // Updated field name
//                 try {
//                     await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/api/kyc-details/', data);
//                     alert('Document saved successfully!');
//                     // Define redirection URLs based on document type
//                     let redirectUrl = 'http://localhost:3000/KycVerification/AdharVerification';
//                     if (documentType === 'PanCard') {
//                         // Add logic for PanCard if needed
//                     }
//                     router.push(redirectUrl);
//                 } catch (error) {
//                     console.error('There was an error saving the document!', error);
//                 }
//             };

//             handleSaveAndRedirect();
//         }
//     }, [documentType, country_name, router]); // Updated dependency array

//     const availableDocuments = country_name === 'India' ? documentOptions.India : documentOptions.Default; // Updated variable name

//     return (
//         <div className={styles.container}>
//             <div className={styles.card}>
//                 <form>
//                     <h1 className={styles.h1}>ID Proof</h1><br/>
//                     <ProgressBar step={2} totalSteps={3} />
//                     <label className={styles.label}><br/>
//                         Issuing country:</label>
//                         <select 
//                             value={country_name} // Updated value
//                             onChange={(e) => setCountryName(e.target.value)} // Updated handler
//                             className={styles.select}
//                         >
//                             {countries.map((country) => (
//                                 <option key={country} value={country}>{country}</option>
//                             ))}
//                         </select>                    
//                     <br />
//                     <div className={styles.documentButtons}>
//                         <label className={styles.label}>Document Type:</label>
//                         {availableDocuments.map((doc) => (
//                             <button 
//                                 type="button" 
//                                 key={doc} 
//                                 className={`${styles.button} ${documentType === doc ? styles.activeButton : ''}`}
//                                 onClick={() => setDocumentType(doc)}
//                             >
//                                 {doc}
//                             </button>
//                         ))}
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default DocumentForm;


'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBackIcon
import styles from './DocumentForm.module.css';
import ProgressBar from './ProgressBar';

const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'Japan', 'China', 'Brazil',
];

const documentOptions = {
    India: ['Government ID'],
    Default: ['Passport']
};

const DocumentForm = () => {
    const [countryName, setCountryName] = useState(countries[0]); // Updated variable name
    const [documentType, setDocumentType] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State for alert visibility
    const [alertMessage, setAlertMessage] = useState(''); // State for alert message
    const router = useRouter();

    useEffect(() => {
        if (documentType) {
            const handleSaveAndRedirect = async () => {
                const data = { country_name: countryName, document_type: documentType }; // Updated field name
                try {
                    await axios.post('https://kycverification-rcfpsxcera-uc.a.run.app/kycverification_api/kyc-details/', data);
                    setAlertMessage('Document saved successfully!');
                    setShowAlert(true);
                    setTimeout(() => {
                        setAlertMessage('');
                        setShowAlert(false);
                        // Define redirection URLs based on document type
                        let redirectUrl = '/KycVerification/AdharVerification';
                        if (documentType === 'PanCard') {
                            // Add logic for PanCard if needed
                        }
                        router.push(redirectUrl);
                    }, 3000); // Hide alert after 3 seconds
                } catch (error) {
                    console.error('There was an error saving the document!', error);
                    setAlertMessage('Error saving document. Please try again.');
                    setShowAlert(true);
                }
            };

            handleSaveAndRedirect();
        }
    }, [documentType, countryName, router]); // Updated dependency array

    const availableDocuments = countryName === 'India' ? documentOptions.India : documentOptions.Default; // Updated variable name

    // Back button click handler
    const handleBackClick = () => {
        router.push('/KycVerification/TransakForm'); // Adjust the path as needed
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Back Arrow */}
                <ArrowBackIcon className={styles.setting_back_icon} onClick={handleBackClick} />
                <form>
                    <h1 className={styles.h1}>ID Proof</h1><br/>
                    <ProgressBar step={2} totalSteps={3} />
                    <label className={styles.label}><br/>
                        Issuing country:</label>
                        <select 
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                            className={styles.select}
                        >
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>                    
                    <br />
                    <div className={styles.documentButtons}>
                        <label className={styles.label}>Document Type:</label>
                        {availableDocuments.map((doc) => (
                            <button 
                                type="button" 
                                key={doc} 
                                className={`${styles.button} ${documentType === doc ? styles.activeButton : ''}`}
                                onClick={() => setDocumentType(doc)}
                            >
                                {doc}
                            </button>
                        ))}
                    </div>
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

export default DocumentForm;
