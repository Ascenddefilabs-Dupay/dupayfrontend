"use client";
import React, { useState, useEffect } from 'react';
import styles from './AddBankAccount.module.css'; // Import CSS
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Bank {
  id: number;
  bank_name: string;
  bank_icon?: string;
}

interface AddBankAccountsProps {
  onAddBankClick: () => void;
  selectedBank?: Bank;
}

const AddBankAccounts: React.FC<AddBankAccountsProps> = ({ onAddBankClick, selectedBank }) => {
  const [linkedBanks, setLinkedBanks] = useState<Bank[]>([]);
  const [noBanksMessage, setNoBanksMessage] = useState<string>('No linked bank accounts.');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId = sessionData.user_id;
        // setUserId(storedUserId);
        console.log(storedUserId);
        console.log(sessionData.user_email);
 
      } else {
        router.push('/Userauthentication/SignIn')
      }
    }
  }, []);

  useEffect(() => {
    // Fetch linked banks
    const fetchLinkedBanks = async () => {
      try {
        const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/api/user/linked_banks/');
        if (res.ok) {
          const data: Bank[] = await res.json();
          setLinkedBanks(data);
          if (data.length === 0) {
            setNoBanksMessage('No linked bank accounts.');
          } else {
            setNoBanksMessage('');
          }
        } else {
          console.error('Failed to fetch linked banks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLinkedBanks();
  }, []);

  return (
    <div className={styles.container1}>
      <div className={styles.topBar}>
        <button className={styles.topBarButton} onClick={() => onAddBankClick()}>
          <FaArrowLeft className={styles.topBarIcon} />
        </button>
        <h2 className={styles.topBarTitle}>Linked Bank Accounts</h2>
      </div>

      {/* Display the selected bank if it exists */}
      {selectedBank && (
        <div className={styles.selectedBankContainer}>
          <h3 className={styles.selectedBankTitle}>Selected Bank</h3>
          <ul className={styles.bankList}>
            <li key={selectedBank.id} className={styles.bankItem}>
              {selectedBank.bank_icon && (
                <img
                  src={selectedBank.bank_icon}
                  alt={`${selectedBank.bank_name} icon`}
                  className={styles.bankIcon}
                />
              )}
              <span>{selectedBank.bank_name}</span>
            </li>
          </ul>
        </div>
      )}

      {linkedBanks.length > 0 ? (
        <ul className={styles.bankList}>
          {linkedBanks.map(bank => (
            <li key={bank.id} className={styles.bankItem}>
              {bank.bank_icon && (
                <img
                  src={bank.bank_icon}
                  alt={`${bank.bank_name} icon`}
                  className={styles.bankIcon}
                />
              )}
              <span>{bank.bank_name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noBanksMessage}>{noBanksMessage}</p>
      )}

      <button className={styles.addBankButton} onClick={onAddBankClick}>
        Add New Bank Account
      </button>
    </div>
  );
};

export default AddBankAccounts;
