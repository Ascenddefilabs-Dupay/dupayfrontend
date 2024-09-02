
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>LOADING</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Inline CSS styles
const styles: React.CSSProperties = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '400px', // Set specific width
    margin: '0 auto', // Center horizontally
    backgroundColor: 'black', // Adjust to your background color
    fontFamily: 'Arial, sans-serif', // Font for the loading text
  },
  spinner: {
    width: '30px',
    height: '30px',
    border: '6px solid #ffffff',
    borderTop: '8px solid #ffffff',
    borderRadius: '20%',
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
