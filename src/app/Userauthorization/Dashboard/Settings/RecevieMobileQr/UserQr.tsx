'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './QRCodeComponent.css';  // Import the CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
const UserAuthorization = process.env.NEXT_PUBLIC_UserAuthorization

const QRCodeComponent: React.FC = () => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [mobileNumber, setMobileNumber] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);  
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();



    const [userID, setUserID] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            if (sessionDataString) {
                const sessionData = JSON.parse(sessionDataString);
                const storedUserId: string = sessionData.user_id;
                setUserID(storedUserId);
                console.log('User ID:', storedUserId);
            } else {
                // setError("User not authenticated");
                // router.push('/Userauthentication/SignIn');
            }
        }
    }, [router]);

    useEffect(() => {
        const fetchQRCode = async () => {
            if (userID) {
                try {
                    const response = await axios.get(`${UserAuthorization}/userauthorizationapi/fetch-qr-code/?user_id=${userID}`);
                    setQrCode(response.data.qr_code);
                    setEmail(response.data.email);
                    setMobileNumber(response.data.mobile_number);
                    setFirstName(response.data.first_name);
                    setError(null);
                } catch (err) {
                    console.error(err);
                    setError('Error fetching QR code data.');
                }
            }
        };
        
        fetchQRCode();
    }, [userID]);

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
                console.error(err);
                setError('Error sharing QR code');
            }
        } else {
            setError('Sharing is not supported on this device.');
        }
    };

    const ReceiveBackClick = () => {
        setTimeout(() => {
          router.push('/Userauthorization/Dashboard/Settings/securityfrom');
        });
    };


    return (
        <div className="container">
            <div className="card">

            <div className="receive">
                <ArrowBackIcon className="receive_icon" onClick={ReceiveBackClick} />
                <h1 className="receive_back_label">Receive Money</h1>
            </div>
                
                {error ? (
                    <div className="error-message">
                        {error}
                    </div>
                ) : (
                    <>
                        
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
