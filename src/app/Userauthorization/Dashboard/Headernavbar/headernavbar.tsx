import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for routing
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faQrcode, faCopy, faPlus } from '@fortawesome/free-solid-svg-icons'; // Add faPlus for the Add icon
import QrScanner from 'react-qr-scanner';
import styles from './header.module.css';
import { redirect } from 'next/navigation';





interface HeadernavbarProps {
    userId: string;
    onCopyUserId?: (userId: string) => void;
}

const Headernavbar: React.FC<HeadernavbarProps> = ({ userId, onCopyUserId }) => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const router = useRouter(); // Initialize useRouter

    // const [userId, setUserId] = useState(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
        // const storedUserId = localStorage.getItem('user_id');
        // setUserId(storedUserId);
        // setAlertMessage('User Need To Login')
        // if (storedUserId === null) redirect('http://localhost:3000/');
        // console.log(storedUserId)
        // console.log(userId)
        }
    }, []);

    const handleIconClick = (iconName: string) => {
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
                // Handle routing logic here
                break;
            default:
                break;
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => console.log('User ID is copied to clipboard'),
            (err) => console.error('Error copying to clipboard:', err)
        );
    };

    const handleScan = (data: any) => {
        if (data) {
            console.log('Scanned QR Code:', data);
            setIsScanning(false);
        }
    };

    const handleError = (err: any) => {
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
