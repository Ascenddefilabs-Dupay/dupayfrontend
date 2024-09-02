"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import styles from './bitcoinpage.module.css';

export default function BitcoinPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const address = searchParams.get('address');
    const [copied, setCopied] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('Segwit');

    const handleCopyClick = () => {
        navigator.clipboard.writeText(address)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleCloseClick = () => {
        router.push('/Userauthorization/receive_btn');
    };

    const handleLearnMoreClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleGotItClick = () => {
        setDropdownVisible(false);
    };

    const handleQRCodeClick = () => {
        navigator.clipboard.writeText(address)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Bitcoin Address',
                text: `Here is my Bitcoin address: ${address}`,
                url: window.location.href
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Sharing is not supported in this browser.');
        }
    };

    const handleToggle = (tab) => {
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
                            value={address}
                            size={135}
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            renderAs="svg"
                            imageSettings={{
                                src: "/bitcoin_img1.png", // Path to your image
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
                            value={address}
                            size={135}
                            fgColor="#000000"
                            level="H"
                            includeMargin={true}
                            renderAs="svg"
                            imageSettings={{
                                src: "/ethereum_image.jpg", // Path to your image
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
}
