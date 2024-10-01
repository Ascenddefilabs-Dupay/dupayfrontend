"use client"
import styles from './transaction.module.css';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

  


const Transactions = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleBackClick = () => {
    setLoading(true); 
    setTimeout(() => {
        router.push('/Userauthorization/Dashboard/Home'); 
    }, 500); 
}; 

const handleNavigation = (route: string) => {
  setLoading(true); 
  setTimeout(() => {
    router.push(route); 
    setLoading(true);
  }, 2000);
};

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
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <center>
            <h1 className={styles.title}>Transactions</h1>
         
          <IconButton
            className={styles.backarrow}
            onClick={handleBackClick}
            sx={{ color: 'white' }}
          >
            <ArrowBackIcon />
          </IconButton>
          </center>
          {/* <body> */}
            
          
          <div className={styles.noTransactions}>
            <div>
              <img
                className={styles.img}
                src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911805/transaction_image_swymyd.png"
                alt="transactions_image"
              />
            </div>
            {/* Uncomment the following line if you need to display the title */}
            {/* <h2 className={styles.noTransactionsTitle}>No transactions yet</h2> */}
            <p className={styles.description}>
              Your Crypto and Fiat activity will appear here
            </p>
            <p className={styles.description}>
              once you start using your wallet.
            </p>
            <button className={styles.addButton}>Transaction history for Crypto</button>
            <button
              className={styles.tipsButton}
              onClick={() => handleNavigation('/TransactionProcessing')}
            >
              Transaction history for Fiat
            </button>
          </div>
          {/* </body> */}
        </>
      )}
    </div>
  );
};

export default Transactions;