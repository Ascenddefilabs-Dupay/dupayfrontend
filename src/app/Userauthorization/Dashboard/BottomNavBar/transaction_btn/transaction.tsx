"use client"
import styles from './transaction.module.css';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

  


const Transactions = () => {
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
  return (
    <div className={styles.container}>      
    <header>
    <h1 className={styles.title}>Transactions</h1>
    </header>
      <div className={styles.noTransactions}>
        <div>
        <img className= {styles.img} src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911805/transaction_image_swymyd.png" alt="transactions_image" />

        </div>
        <h2 className={styles.noTransactionsTitle}>No transactions yet</h2>
        <p className={styles.description}>
          Your crypto and NFT activity will appear here 
        </p>
        <p  className={styles.description}>   once you start using your wallet.</p>

        <button className={styles.addButton}>Add crypto to your wallet</button>
        <button className={styles.tipsButton}>Tips for getting started</button>
      </div>
      <nav className={styles.navbar}>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
        <button className={styles.navButton}></button>
      </nav>
    </div>
  );
};

export default Transactions;
