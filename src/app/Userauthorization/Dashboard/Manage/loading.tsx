import React from 'react';

const Loading: React.FC = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>LOADING, please wait...</p>
    </div>
  );
};

// Inline CSS styles
const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '400px',
    margin: '0 auto',
    backgroundColor: 'black',
    fontFamily: 'Arial, sans-serif',
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '6px solid #ffffff',
    borderTop: '8px solid #ffffff',
    borderRadius: '50%', // Use '50%' for a perfect circle
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '20px',
    color: 'white',
    letterSpacing: '2px',
  },
};

export default Loading;
