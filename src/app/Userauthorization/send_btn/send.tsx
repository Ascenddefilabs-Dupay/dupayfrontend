"use client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Send: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/Userauthorization/Dashboard'); // Navigate after delay
        }, 500); // Adjust delay if needed
    };

    const handleAddCryptoClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
            router.push('/FiatManagement/Currency_Conversion'); // Navigate after delay
        }, 15000); // Adjust delay if needed
    };

    return (
        <div style={{ backgroundColor: 'black', width: '400px', margin: '0 auto', height: '100vh', color: 'white', borderRadius: '12px', top: '1px', alignItems: 'center', }}>
            <ArrowBackIcon onClick={handleBackClick} style={{ margin: '15px 10px' }} />
            {loading ? (
                <div style={styles.loaderContainer}>
                    <div style={styles.loader}></div>
                </div>
            ) : (
                <>
                    <h1 style={{ marginTop: '-40px', marginLeft: '45px', cursor: 'pointer' }}>Send</h1>
                    <div style={{ alignItems: 'center' }}>
                        <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911804/send_image_ipuouh.png" alt="Send_Image" style={{ height: '160px', width: '160px', marginLeft: '112px', marginTop: '20px' }} />
                    </div>
                    <div style={{ marginTop: '50px' }}>
                        <p style={{ marginLeft: '100px' }}>To send, first add crypto to</p>
                        <p style={{ marginLeft: '160px' }}>your wallet</p>
                        <div style={{ marginRight: '66px', position: 'relative' }}>
                            <p style={{ marginTop: '10px', marginLeft: '60px', color: 'gray', fontSize: '13px' }}>Use a Dupay account to buy or transfer</p>
                            <p style={{ color: 'gray', fontSize: '13px', marginLeft: '90px' }}>crypto, or receive assets directly.</p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleAddCryptoClick}
                            style={{
                                marginTop: '85px',
                                padding: '10px',
                                background: 'linear-gradient(90deg, #007bff9f, #800080)',
                                color: 'white',
                                borderRadius: '25px',
                                fontWeight: 'bold',
                                border: 'none',
                                width: '90%',
                                marginLeft: '23px',
                            }}
                        >
                            Add crypto to your wallet
                        </button>
                    </div>
                </>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// Inline CSS styles
const styles = {
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 1.5)', // Set background color to black
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        zIndex: 2,
        padding: '20px',
        borderRadius: '20px',
        width: '400px',
        margin: '0 auto',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
    } as React.CSSProperties,
    loader: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(45deg, #ff007b, #007bff)',
        borderRadius: '12%',
        animation: 'spin 1s linear infinite',
        transform: 'rotate(45deg)',
        position: 'relative',
        zIndex: 3,
        boxShadow: '0 0 20px rgba(255, 0, 123, 0.7), 0 0 20px rgba(0, 123, 255, 0.7)',
    } as React.CSSProperties,
    loadingText: {
        fontSize: '20px',
        color: 'white',
        letterSpacing: '2px',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
    } as React.CSSProperties,
};

export default Send;
