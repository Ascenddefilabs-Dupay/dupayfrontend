"use client";
import React, { useState, useEffect } from 'react';
import { useRouter,useSearchParams, } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import styles from './bitcoinpage.module.css';
import { redirect } from 'next/navigation';

// const [userId, setUserId] = useState(null);

// Define the types for the props and state
interface BitcoinPageProps {}

const BitcoinPage: React.FC<BitcoinPageProps> = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [address, setAddress] = useState<string | null>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'Segwit' | 'Legacy'>('Segwit');

   
    useEffect(() => {
        // Retrieve query parameters on component mount
        const query = new URLSearchParams(window.location.search);
        const addressParam = query.get('address');
        setAddress(addressParam);
    }, []);

    const [userId, setUserId] = useState<string | null>(null);
    
        useEffect(() => {
            if (typeof window !== 'undefined') {
            const sessionDataString = window.localStorage.getItem('session_data');
            // if (sessionDataString) {
            //   const sessionData = JSON.parse(sessionDataString);
            //   const storedUserId = sessionData.user_id;
            //   setUserId( );
            //   console.log(storedUserId);
            //   console.log(sessionData.user_email);
            // } else {
            //   redirect('http://localhost:3000/Userauthentication/SignIn');
            // }
            }
        }, []);

    const handleCopyClick = () => {
        if (address) {
            navigator.clipboard.writeText(address)
                .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        }
    };

    const handleCloseClick = () => {
        router.push('/Userauthorization/receive_btn'); // Navigate using router.push
    };

    const handleLearnMoreClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleGotItClick = () => {
        setDropdownVisible(false);
    };

    const handleQRCodeClick = () => {
        handleCopyClick(); // Reuse handleCopyClick function
    };

    // const handleShareClick = () => {
    //     if (address && navigator.share) {
    //         navigator.share({
    //             title: 'Bitcoin Address',
    //             text: `Here is my Bitcoin address: ${address}`,
    //             url: window.location.href
    //         }).catch((error) => console.error('Error sharing:', error));
    //     } else {
    //         alert('Sharing is not supported in this browser.');
    //     }
    // };

    
    const handleShareClick = () => {
        if (address && navigator.share) {
            const shareUrl = `${window.location.origin}${window.location.pathname}${window.location.search}`;
            navigator.share({
                title: 'Bitcoin Address',
                text: `Here is my Bitcoin address: ${address}`,
                url: shareUrl,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };
    

    const handleToggle = (tab: 'Segwit' | 'Legacy') => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.container}>
            <div className={styles.closeButton} onClick={handleCloseClick}>
                <IoMdClose className={styles.closeIcon} />
            </div>
            <div className={styles.header}>
                <div
                    className={`${styles.tab} ${activeTab === 'Segwit' ? styles.active : ''}`}
                    onClick={() => handleToggle('Segwit')}
                >
                    Segwit
                </div>
                <div
                    className={`${styles.tab} ${activeTab === 'Legacy' ? styles.active : ''}`}
                    onClick={() => handleToggle('Legacy')}
                >
                    Legacy
                </div>
            </div>
            
            {activeTab === 'Segwit' && (
                <div className={styles.content}>
                    <div className={styles.qrCodeContainer}>
                        <QRCode
                            value={address || ''}
                            size={135}
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            renderAs="svg"
                            imageSettings={{
                                src: "https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933124/bitcoin_img1_okht2d.png",
                                x: 40,
                                y: 35,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>
                    <div className={styles.addressContainer}>
                        <p className={styles.addressLabel}>Your Bitcoin Segwit address</p>
                        <p className={styles.address}>{address}</p>
                        <div className={`${styles.copyButtonContainer} ${copied ? styles.copiedButtonContainer : ''}`}>
                            <button className={styles.copyButton} onClick={handleCopyClick}>
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.infoText}>
                            Transactions may take a few minutes to complete.
                        </p>
                        <p className={styles.infoText}>
                            <Link href=" " className={styles.link} target="_blank">
                                Learn more </Link>
                             about Segwit vs Legacy.</p>
                    </div>
                    <div className={styles.shareButtonContainer}>
                        <button className={styles.shareButton} onClick={handleShareClick}>
                            Share your address
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'Legacy' && (
                <div className={styles.content}>
                    <div className={styles.qrCodeContainer}>
                        <QRCode
                            value={address || ''}
                            size={135}
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            renderAs="svg"
                            imageSettings={{
                                src: "https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933125/ethereum_image_pjztx6.jpg",
                                x: 40,
                                y: 35,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>
                    <div className={styles.addressContainer}>
                        <p className={styles.addressLabel}>Your Bitcoin Legacy address</p>
                        <p className={styles.address}>{address}</p>
                        <div className={`${styles.copyButtonContainer} ${copied ? styles.copiedButtonContainer : ''}`}>
                            <button className={styles.copyButton} onClick={handleCopyClick}>
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <p className={styles.infoText}>
                            Transactions may take a few minutes to complete.
                        </p>
                        <p className={styles.infoText}>
                            <Link href=" " className={styles.link} target="_blank">
                                Learn more </Link>
                            about Segwit vs Legacy
                        </p>
                    </div>
                    <div className={styles.shareButtonContainer}>
                        <button className={styles.shareButton} onClick={handleShareClick}>
                            Share your address
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BitcoinPage;
