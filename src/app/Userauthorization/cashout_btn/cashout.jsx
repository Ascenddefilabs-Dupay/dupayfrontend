"use client";
import { useRouter } from 'next/navigation';
import { MdOutlineCancel } from "react-icons/md";
import React, { useState } from 'react';

export default function Cashout() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handleBackClick = () => {
        setLoading(true); // Show loading text
        setTimeout(() => {
        router.push('/Userauthorization/Dashboard');
        }, 500);
    };

    return (
        <div style={{
            backgroundColor: 'black', 
            width: '400px', 
            position: 'relative',
            margin: '0 auto', 
            height: '100vh', 
            color: 'white',
            borderRadius: '12px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            fontFamily: 'Arial, Helvetica, sans-serif', /* Set the font for the entire container */

        }}>
            {loading ? (
                <div style={styles.loaderContainer}>
                <div style={styles.loader}></div>
                </div>
            ) : (
                <>
            <MdOutlineCancel 
                onClick={handleBackClick}  
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '24px',
                    cursor: 'pointer'
                }}
            />
            <h1 style={{ marginTop: '40px' }}>
                {/* Your heading content here */}
            </h1>

            <div style={{ marginTop: '60px' }}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724933125/Cashout_image_odcfls.jpg" alt="Cashout_Image" style={{ height: '100px' }} />
            </div>
            <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <p>You're being redirected to</p>                
                <p>Alchemy Pay to complete cash</p>
                <p>out process</p>
            </div>
            <p style={{ color: 'gray', fontSize: '12px', marginTop: '85px' }}>
                Alchemy Pay is not affiliated with Wallet in any way.
            </p>         
            <button 
                onClick={() => router.push('/Userauthorization/Dashboard')}
                style={{
                    padding: '10px',
                    background: 'linear-gradient(90deg, #007bff9f, #800080)',
                    color: 'white',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    border: 'none',
                    width: '90%',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Continue
            </button>
            </>
            )}
        </div>
    );
}

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
        width:'400px',
        margin:'0 auto',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
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
      },
      loadingText: {
        fontSize: '20px',
        color: 'white',
        letterSpacing: '2px',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
      },
    };