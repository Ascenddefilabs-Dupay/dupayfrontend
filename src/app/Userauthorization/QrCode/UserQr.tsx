


// 'use client';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const QRCodeComponent: React.FC = () => {
//     const [qrCode, setQrCode] = useState<string | null>(null);
//     const [email, setEmail] = useState<string | null>(null);
//     const [mobileNumber, setMobileNumber] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     const userId = 'DupC0005';  // Hardcoded user ID

//     useEffect(() => {
//         const fetchQRCode = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/transaction_api/fetch-qr-code/?user_id=${userId}`);
//                 setQrCode(response.data.qr_code);
//                 setEmail(response.data.email);
//                 setMobileNumber(response.data.mobile_number);
//             } catch (err) {
//                 setError('Error fetching QR code');
//             }
//         };

//         fetchQRCode();
//     }, [userId]);

//     // Download QR Code as an image
//     const downloadQRCode = () => {
//         if (qrCode) {
//             const link = document.createElement('a');
//             link.href = `data:image/png;base64,${qrCode}`;
//             link.download = 'qr_code.png';
//             link.click();
//         }
//     };

//     // Share QR Code via Web Share API (if supported)
//     const shareQRCode = async () => {
//         if (navigator.share && qrCode) {
//             try {
//                 const blob = await (await fetch(`data:image/png;base64,${qrCode}`)).blob();
//                 const file = new File([blob], 'qr_code.png', { type: 'image/png' });
//                 await navigator.share({
//                     files: [file],
//                     title: 'Share QR Code',
//                     text: 'Here is my QR code.',
//                 });
//             } catch (err) {
//                 setError('Error sharing QR code');
//             }
//         } else {
//             setError('Sharing is not supported on this device.');
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
//                 {error ? (
//                     <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
//                         {error}
//                     </div>
//                 ) : (
//                     <>
//                         {qrCode ? (
//                             <>
//                                 <h1 className="text-2xl font-bold mb-4 text-center">Your QR Code</h1>
//                                 <div className="flex flex-col items-center mb-4">
//                                     <img 
//                                         src={`data:image/png;base64,${qrCode}`} 
//                                         alt="User's QR Code" 
//                                         className="w-48 h-48 mb-4"
//                                     />
//                                     <p className="text-center text-gray-500 mb-2">Scan the code to proceed</p>
//                                     <p className="text-center text-gray-700 mb-2">Email: {email}</p>
//                                     <p className="text-center text-gray-700">Mobile Number: {mobileNumber}</p>
//                                 </div>
//                                 <div className="flex justify-center space-x-4">
//                                     <button
//                                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                                         onClick={downloadQRCode}
//                                     >
//                                         Download
//                                     </button>
//                                     <button
//                                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                                         onClick={shareQRCode}
//                                     >
//                                         Share
//                                     </button>
//                                 </div>
//                             </>
//                         ) : (
//                             <p className="text-gray-500 text-center">No QR code available</p>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default QRCodeComponent;



'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './QRCodeComponent.css';  // Import the CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const QRCodeComponent: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const userId = 'DupC0005';  // Hardcoded user ID
    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId: string = sessionData.user_id;
                setUserID(storedUserId);
                console.log(storedUserId);
                // console.log(sessionData.user_email);
            } else {
                // router.push('/Userauthentication/SignIn');
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/transaction_api/fetch-qr-code/?user_id=${userId}`);
                setQrCode(response.data.qr_code);
                setEmail(response.data.email);
                setMobileNumber(response.data.mobile_number);
            } catch (err) {
                setError('Error fetching QR code');
            }
        };

        fetchQRCode();
    }, [userId]);

    // Download QR Code as an image
    const downloadQRCode = () => {
        if (qrCode) {
            const link = document.createElement('a');
            link.href = `data:image/png;base64,${qrCode}`;
            link.download = 'qr_code.png';
            link.click();
        }
    };

    const handleBackClick = () => {
        // setShowLoader(true);
    
        setTimeout(() => {
        //   setShowLoader(false);
          router.push('/Userauthorization/Dashboard');
        });
      };

    // Share QR Code via Web Share API (if supported)
    const shareQRCode = async () => {
        if (navigator.share && qrCode) {
            try {
                const blob = await (await fetch(`data:image/png;base64,${qrCode}`)).blob();
                const file = new File([blob], 'qr_code.png', { type: 'image/png' });
                await navigator.share({
                    files: [file],
                    title: 'Share QR Code',
                    text: 'Here is my QR code.',
                });
            } catch (err) {
                setError('Error sharing QR code');
            }
        } else {
            setError('Sharing is not supported on this device.');
        }
    };

    return (
        <div className="container">
            <div className="card">
                {error ? (
                    <div className="error-message">
                        {/* <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} /> */}
                        {error}
                    </div>
                ) : (
                    <>
                        {qrCode ? (
                            <>
                                <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
                                <h1 className="center-text">Your QR Code</h1>
                                <div className="qr-container">
                                    <img 
                                        src={`data:image/png;base64,${qrCode}`} 
                                        alt="User's QR Code" 
                                        className="qr-image"
                                    />
                                    <p className="center-text">Scan the code to proceed</p>
                                    <p className="email">Email: {email}</p>
                                    <p className="mobile-number">Mobile Number: {mobileNumber}</p>
                                </div>
                                <div className="button-container">
                                    <button
                                        className="button button-download"
                                        onClick={downloadQRCode}
                                    >
                                        Download
                                    </button>
                                    <button
                                        className="button button-share"
                                        onClick={shareQRCode}
                                    >
                                        Share
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="center-text">No QR code available</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default QRCodeComponent;
