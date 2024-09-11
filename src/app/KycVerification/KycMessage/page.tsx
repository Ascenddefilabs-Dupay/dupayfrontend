'use client';
import React, { useEffect } from 'react';
import ProgressBar from '../kycform1/ProgressBar';

const IDProofAndSelfie = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'http://localhost:3000/KycVerification/PersonalDetails';
    }, 2000); // 2000 milliseconds = 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>ID Proof</h2><br /><br />
        <ProgressBar step={3} totalSteps={3} />
        <div style={styles.checkmarkContainer}>
          <div style={styles.checkmark}>✓</div>
        </div>
        <p style={styles.thankYou}>Thank you</p>
        <p style={styles.message}>That is all we need to start verifying your identity</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'white',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as 'column', // Explicitly typed value for flexDirection
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'black',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxWidth: '400px',
    width: '80%',
    boxSizing: 'border-box',
    height: '570px', // Set the height to 570px
  },
  title: {
    margin: '20px',
    fontSize: '25px',
    fontWeight: 'bold',
    color: 'white',
  },
  menuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  checkmarkContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#e0f7fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  checkmark: {
    color: '#00bcd4',
    fontSize: '40px',
    animation: 'checkmark-animation 2s ease-in-out',
  },
  thankYou: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: 'white',
  },
  message: {
    fontSize: '16px',
    color: '#999',
  },
};

export default IDProofAndSelfie;
