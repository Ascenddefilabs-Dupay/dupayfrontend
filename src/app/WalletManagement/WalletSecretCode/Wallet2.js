// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { FaArrowLeft } from "react-icons/fa";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
// import './style.css'; // Ensure this path is correct
// import axios from 'axios';
// import ProgressBar from '../WalletCreation/ProgressBar';

// function Wallet2() {
  
//   const [isTextVisible, setIsTextVisible] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
//   const [randomWords, setRandomWords] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     setIsClient(true);
//     fetchRandomWords();
//   }, []);

//   const fetchRandomWords = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/api/recovery-phrase/');
//       const words = response.data.phrase;
//       setRandomWords(words);
//       localStorage.setItem('recoveryWords', words); // Store in localStorage
//     } catch (error) {
//       console.error('Error fetching random words:', error);
//     }
//   };

//   const toggleVisibility = () => {
//     setIsTextVisible(!isTextVisible);
//   };

//   const handleCopyClick = () => {
//     navigator.clipboard.writeText(randomWords).then(() => {
//       alert('Text copied to clipboard!');
//     }).catch(err => {
//       console.error('Failed to copy text: ', err);
//     });
//   };

//   const handleCheckboxChange = (event) => {
//     setIsCheckboxChecked(event.target.checked);
//   };

//   const handleContinueClick = () => {
//     if (isCheckboxChecked) {
//       // Send the recovery phrase to the next page using URL parameters
//       router.push(`http://localhost:3000/WalletManagement/WalletSecretCode/success?phrase=${encodeURIComponent(randomWords)}`);
//     } else {
//       alert('Please check the checkbox before continuing.');
//     }
//   };

//   const handleLeftArrowClick = () => {
//     window.location.href = './CreatePassword';
//   };

//   return (
//     <div className="wrapper">
//       <div className="container">
//         <div className="column left" onClick={handleLeftArrowClick}>
//           {/* <FontAwesomeIcon icon={faArrowLeft} /> */}
//           <FaArrowLeft />
//         </div>
//         <div className="column middle">
//           <ProgressBar currentStep={2} totalSteps={4} />
//         </div>
//         <div className="column right">
//           {/* Right column content */}
//         </div>
//       </div>
//       <h1 className="header">Back up your wallet</h1>
//       <p className="description">
//         Save these 12 words to a password manager, or write down and store in a secure place.
//         Do not share with anyone.
//       </p>
//       <div className="textbox">
//         <div className="text-line">
//           {isClient && (isTextVisible ? randomWords : "• • • • • • • • • • • • • • • • • • • • • • • •  • • • • • • • • • • • • •  • • • • •")}
//         </div>
//         <div className="icon-container">
//           <span className="icon" onClick={toggleVisibility}>
//             <FontAwesomeIcon icon={isTextVisible ? faEye : faEyeSlash } />
//           </span>
//         </div>
//       </div>
//       <p className="description2">
//         <FontAwesomeIcon icon={faCopy} className="copy-icon" onClick={handleCopyClick} />
//         copy to clipboard
//       </p>
//       <div className="checkbox-container">
//         <label>
//           <input type="checkbox" className="checkbox" onChange={handleCheckboxChange} />
//           I understand that if I lose my recovery phrase, I’ll lose all of the crypto in my wallet.
//         </label>
//       </div>
//       <button className="continue-button" onClick={handleContinueClick}>Continue</button>
//     </div>
//   );
// }

// export default Wallet2;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCopy } from '@fortawesome/free-solid-svg-icons';
import './style.css'; // Ensure this path is correct
import ProgressBar from '../WalletCreation/ProgressBar';

function Wallet2() {
    const [isTextVisible, setIsTextVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [randomWords, setRandomWords] = useState('');
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        generateRandomWords();
    }, []);

    const generateRandomWords = () => {
        const words = Array.from({ length: 12 }, () => generateRandomWord()).join(' ');
        setRandomWords(words);
        localStorage.setItem('recoveryWords', words); // Store in localStorage
    };

    const generateRandomWord = () => {
        const length = Math.floor(Math.random() * 3) + 4; // Length between 4 and 6
        let word = '';
        for (let i = 0; i < length; i++) {
            word += String.fromCharCode(Math.floor(Math.random() * 26) + 97); // Generate random lowercase letter
        }
        return capitalizeFirstLetter(word);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const toggleVisibility = () => {
        setIsTextVisible(!isTextVisible);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(randomWords).then(() => {
            alert('Text copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked);
    };

    const handleContinueClick = () => {
        if (isCheckboxChecked) {
            // Retrieve wallet_id and password from localStorage
            const walletId = localStorage.getItem('wallet_id');
            const password = localStorage.getItem('password');
            const recoveryWords = localStorage.getItem('recoveryWords');

            console.log("Wallet ID:", walletId);
            console.log("Password:", password);
            console.log("Recovery Words:", recoveryWords);


            // Send the data to the next page using URL parameters
            router.push(`/WalletManagement/WalletSecretCode/success?wallet_id=${(walletId)}&password=${(password)}&phrase=${(recoveryWords)}`);
        } else {
            alert('Please check the checkbox before continuing.');
        }
    };

    const handleLeftArrowClick = () => {
        window.location.href = './CreatePassword';
    };

    return (
        <div className="wrapper1">
        <div className="wrapper">
            <div className="container">
                <div className="column left" onClick={handleLeftArrowClick}>
                    <FaArrowLeft />
                </div>
                <div className="column middle">
                    <ProgressBar currentStep={3} totalSteps={4} />
                </div>
                <div className="column right">
                    {/* Right column content */}
                </div>
            </div>
            <h1 className="header">Back up your wallet</h1>
            <p className="description">
                Save these 12 words to a password manager, or write down and store in a secure place.
                Do not share with anyone.
            </p>
            <div className="textbox">
                <div className="text-line">
                    {isClient && (isTextVisible ? randomWords : "• • • • • • • • • • • • • • • • • • • • • • • •  • • • • • • • • • • • • •  • • • • •")}
                </div>
                <div className="icon-container">
                    <span className="icon" onClick={toggleVisibility}>
                        <FontAwesomeIcon icon={isTextVisible ? faEye : faEyeSlash } />
                    </span>
                </div>
            </div>
            <p className="description2">
                <FontAwesomeIcon icon={faCopy} className="copy-icon" onClick={handleCopyClick} />
                copy to clipboard
            </p>
            <div className="checkbox-container">
                <label>
                    <input type="checkbox" className="checkbox" onChange={handleCheckboxChange} />
                    I understand that if I lose my recovery phrase, I’ll lose all of the crypto in my wallet.
                </label>
            </div>
            <button className="continue-button" onClick={handleContinueClick}>Continue</button>
        </div>
        </div>
    );
}

export default Wallet2;
