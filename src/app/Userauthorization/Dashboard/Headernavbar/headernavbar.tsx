'use client';
import styles from "./header.module.css";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faQrcode, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons'; // Add faPlus for the Add icon

import QrScanner from 'react-qr-scanner';

const Headernavbar = ({ userId, onCopyUserId }) => {
    const [isScanning, setIsScanning] = useState(false);
    const router = useRouter(); // Initialize useRouter

    const handleIconClick = (iconName) => {
        console.log(`${iconName} button clicked`);
        switch (iconName) {
            case 'Scanner':
                setIsScanning(true);
                break;
            case 'Notification':
                // Handle notification logic here
                break;
            case 'Copy':
                copyToClipboard(userId);
                // console.log('UserId:', userId);
                break;
            case 'Add': // Add case for routing
                break;
            default:
                break;
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            () => console.log('user id is Copied to clipboard'),
            (err) => console.error('Error copying to clipboard:', err)
        );
    };

    const handleScan = (data) => {
        if (data) {
            console.log('Scanned QR Code:', data);
            setIsScanning(false);
        }
    };

    const handleError = (err) => {
        console.error('Error scanning QR Code:', err);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.leftSection}></div>
                <div className={styles.rightSide}>
                    <FontAwesomeIcon 
                        icon={faPlus} // Add icon for the "Add" button
                        style={{fontSize: '18px'}}
                        onClick={() => handleIconClick('Add')} // Handle click to route
                    />
                    <FontAwesomeIcon 
                        icon={faCopy} 
                        size="1x" 
                        onClick={() => handleIconClick('Copy')} 
                    />
                    <FontAwesomeIcon 
                        icon={faQrcode} 
                        size="1x" 
                        onClick={() => handleIconClick('Scanner')} 
                    />
                    <FontAwesomeIcon 
                        icon={faBell} 
                        onClick={() => handleIconClick('Notification')} 
                    />
                </div>
            </div>
            {isScanning && (
                <div className={styles.fullScreenScanner}>
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%' }}
                    />
                    <button className={styles.closeButton} onClick={() => setIsScanning(false)}>Close Scanner</button>
                </div>
            )}
        </div>
    );
};

export default Headernavbar;
