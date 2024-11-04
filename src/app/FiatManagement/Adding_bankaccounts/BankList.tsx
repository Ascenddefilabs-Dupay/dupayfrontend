"use client";
import React, { useState, useEffect } from 'react';
import styles from './BankList.module.css'; // Import CSS
import { useRouter } from 'next/navigation';

interface Bank {
  id: number;
  bank_name: string;
  bank_icon?: string;
}

interface BankListProps {
  onBankSelect: (bank: Bank) => void;
}

const BankList: React.FC<BankListProps> = ({ onBankSelect }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
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
    const fetchBanks = async () => {
      try {
        const res = await fetch('https://fiatmanagement-ind-255574993735.asia-south1.run.app/api/banks/');
        if (res.ok) {
          const data: Bank[] = await res.json();
          setBanks(data);
        } else {
          console.error('Failed to fetch banks');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBanks();
  }, []);

  const filteredBanks = banks.filter(bank =>
    bank.bank_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search banks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />
      <ul className={styles.bankList}>
        {filteredBanks.map(bank => (
          <li 
            key={bank.id} 
            className={styles.bankItem}
            onClick={() => onBankSelect(bank)} // Notify parent of selection
          >
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
    </div>
  );
};

export default BankList;
