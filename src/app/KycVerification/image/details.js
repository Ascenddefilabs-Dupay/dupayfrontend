'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './FetchKYCDetails.module.css';

const FetchKYCDetails = () => {
  const [kycDetails, setKycDetails] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get('https://kycverification-ind-255574993735.asia-south1.run.app/kycverification_api/kyc-details/');
        setKycDetails(response.data);
      } catch (error) {
        console.error('Error fetching KYC details:', error);
        setError('Error fetching KYC details. Please try again.');
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className={styles.container}>
      <h2>KYC Details</h2>
      {error && <p className={styles.error}>{error}</p>}
      {kycDetails.length === 0 ? (
        <p>No KYC details found.</p>
      ) : (
        kycDetails.map((detail, index) => (
          <div key={index} className={styles.card}>
            <h3>KYC Detail #{index + 1}</h3>
            <p><strong>Country:</strong> {detail.country}</p>
            <p><strong>Document Type:</strong> {detail.document_type}</p>
            <p><strong>Aadhar Number:</strong> {detail.adhar_number}</p>
            {detail.adhar_front_image && (
              <div>
                <h4>Aadhar Front Image:</h4>
                <img src={detail.adhar_front_image} alt="Aadhar Front" className={styles.image} />
              </div>
            )}
            {detail.adhar_back_image && (
              <div>
                <h4>Aadhar Back Image:</h4>
                <img src={detail.adhar_back_image} alt="Aadhar Back" className={styles.image} />
              </div>
            )}
            <p><strong>PAN Number:</strong> {detail.pan_number}</p>
            {detail.pan_front_image && (
              <div>
                <h4>PAN Front Image:</h4>
                <img src={detail.pan_front_image} alt="PAN Front" className={styles.image} />
              </div>
            )}
            {detail.pan_back_image && (
              <div>
                <h4>PAN Back Image:</h4>
                <img src={detail.pan_back_image} alt="PAN Back" className={styles.image} />
              </div>
            )}
            <p><strong>Investment:</strong> {detail.investment ? 'Yes' : 'No'}</p>
            <p><strong>NFTs:</strong> {detail.nfts ? 'Yes' : 'No'}</p>
            <p><strong>Web3:</strong> {detail.web3 ? 'Yes' : 'No'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FetchKYCDetails;
