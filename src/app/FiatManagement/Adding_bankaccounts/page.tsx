"use client";
import React, { useState } from 'react';
import AddBankAccounts from './AddBankAccounts'; // Import components
import BankList from './BankList';
import styles from './AddBankAccount.module.css'; // Import CSS

// Define the Bank interface to match the shape of the bank objects
interface Bank {
  id: number;
  bank_name: string;
  bank_icon?: string;
}

const AddingBankAccountsPage: React.FC = () => {
  const [view, setView] = useState<'add' | 'bankList'>('add'); // State to toggle views
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null); // State for selected bank

  const handleAddBankClick = () => {
    setView('bankList'); // Switch view to BankList
  };

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank); // Set selected bank
    setView('add'); // Switch back to AddBankAccounts view
  };

  return (
    <div className={styles.container}>
      {view === 'add' ? (
        <AddBankAccounts
          onAddBankClick={handleAddBankClick}
          selectedBank={selectedBank} // Pass selected bank to AddBankAccounts
        />
      ) : (
        <BankList onBankSelect={handleBankSelect} /> // Pass function to BankList
      )}
    </div>
  );
};

export default AddingBankAccountsPage;
