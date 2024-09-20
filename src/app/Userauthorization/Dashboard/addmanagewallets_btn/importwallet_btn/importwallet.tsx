'use client';
import { useState, useEffect} from 'react';
import styles from './importwallet.module.css';
import { useRouter } from 'next/navigation';
import { IoMdArrowRoundBack } from "react-icons/io";
import { redirect } from 'next/navigation';


const Importwallet = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isLinkVisible, setIsLinkVisible] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      // if (sessionDataString) {
      //   const sessionData = JSON.parse(sessionDataString);
      //   const storedUserId = sessionData.user_id;
      //   setUserId(storedUserId);
      //   console.log(storedUserId);
      //   console.log(sessionData.user_email);
      // } else {
      //   redirect('http://localhost:3000/Userauthentication/SignIn');
      // }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setLoading(false);
        // setShowForm(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    setLoading(true); // Show loading text
    setTimeout(() => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn');
    setLoading(false); 
  }, 1000); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value) {
      setError('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        Enter your wallets 12-word recovery phrase or private key.
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
