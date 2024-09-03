'use client';
import React, { useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import styles from './importwallet.module.css';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";

const Importwallet: React.FC = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLinkVisible, setIsLinkVisible] = useState<boolean>(true);

  const handleBackClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setError('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleImportClick();
    }
  };

  const handleImportClick = () => {
    if (validateInput(inputValue)) {
      console.log('Valid input');
      // Perform import wallet action here
    } else {
      setError('Enter a valid 12-word recovery phrase or 64-character private key.');
      setIsLinkVisible(false);
    }
  };

  const validateInput = (input: string) => {
    const isValidRecoveryPhrase = input.split(' ').length === 12;
    const isValidPrivateKey = input.length === 64;
    return isValidRecoveryPhrase || isValidPrivateKey;
  };

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={handleBackClick}>
        <IoMdArrowRoundBack style={{ color: '#fff' }} />
      </div>
      <div className={styles.progressBar}></div>
      <h1 className={styles.heading}>Import wallet</h1>
      <p className={styles.paragraph}>
        Enter your wallet's 12-word recovery phrase or private key.
        You can import any Ethereum, Solana, or Bitcoin recovery phrase.
        Only Ethereum private keys are supported.
      </p>
      <div className={styles.add}>
        <input
          type="text"
          placeholder="Recovery phrase or private key"
          className={`${styles.search} ${inputValue ? 'active' : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      {isLinkVisible ? (
        <div className={styles.link}>
          <a href="https://www.Dupay.com/wallet/articles/getting-started-extension#import-existing-wallet">Where can I find it?</a>
        </div>
      ) : (
        <p className={styles.errorText}>{error}</p>
      )}
      <button
        className={`${styles.importButton} ${inputValue ? 'active' : ''}`}
        onClick={handleImportClick}
      >
        Import wallet
      </button>
    </div>
  );
};

export default Importwallet;
