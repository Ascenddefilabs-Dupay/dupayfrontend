


'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './QRCodeComponent.css';  // Import the CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

const QRCodeComponent: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);  // Add first name state
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // const userId = 'DupC0004';  // Hardcoded user ID

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
                const response = await axios.get(`http://userprofile-ind-255574993735.asia-south1.run.app/userprofileapi/fetch-qr-code/?user_id=${userID}`);
                setQrCode(response.data.qr_code);
                setEmail(response.data.email);
                setMobileNumber(response.data.mobile_number);
                setFirstName(response.data.first_name);  // Set the fetched first name
            } catch (err) {
                setError('Error fetching QR code');
            }
        };

        fetchQRCode();
    }, [userID]);

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

    const handleBackClick = () => {
        setTimeout(() => {
          router.push('/Userauthorization/Dashboard/Home');
        });
    };

    return (
        <div className="container">
            <div className="card">
                <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
                {error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <>
                        <h1 className="profile-heading">View Profile</h1>
                        <div className="profile-details">
                            <p className="detail">Name: {firstName}</p>
                            <p className="detail">Email: {email}</p>
                            <p className="detail">Mobile Number: {mobileNumber}</p>
                        </div>
                        <h2 className="qr-heading">QR Code</h2>
                        <div className="qr-container">
                            {qrCode ? (
                                <>
                                    <img 
                                        src={`data:image/png;base64,${qrCode}`} 
                                        alt="User's QR Code" 
                                        className="qr-image"
                                    />
                                    <div className="button-container">
                                        <a
                                            href={`data:image/png;base64,${qrCode}`}
                                            download="qr_code.png"
                                            className="link-button link-download"
                                        >
                                            <DownloadIcon className="icon" />
                                            Download QR
                                        </a>
                                        <a
                                            href={`data:image/png;base64,${qrCode}`}
                                            className="link-button link-share"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                shareQRCode();
                                            }}
                                        >
                                            <ShareIcon className="icon" />
                                            Share QR
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <p className="center-text">No QR code available</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QRCodeComponent;
