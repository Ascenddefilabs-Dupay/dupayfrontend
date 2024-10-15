"use client"
import styles from './transaction.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LottieAnimationLoading from '../../../../assets/LoadingAnimation';


const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 
  
  
  const handleNavigation = (route: string) => {
    setLoading(true); 
    router.push(route); 

    // setTimeout(() => {
    // }, 2000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      // Uncomment and modify this section as needed
      // if (sessionDataString) {
      //   const sessionData = JSON.parse(sessionDataString);
      //   const storedUserId = sessionData.user_id;
      //   setUserId(storedUserId);
      // } else {
      //   router.push('/Userauthentication/SignIn');
      // }
    }
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' , backgroundColor: 'black'}}>
        {/* Show the Lottie loading animation */}
        <LottieAnimationLoading width="300px" height="300px" />
      </div>
      ) : (
        <>
          <center>
            <h1 className={styles.title}>Transactions</h1>
            
          </center>
          
          <div className={styles.noTransactions}>
            <div>
              <img
                className={styles.img}
                src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911805/transaction_image_swymyd.png"
                alt="transactions_image"
              />
            </div>
            <p className={styles.description}>
              Your Crypto and Fiat activity will appear here once you start using your wallet.
            </p>
            <button className={styles.addButton}>Transaction history for Crypto</button>
            <button
              className={styles.tipsButton}
              onClick={() => handleNavigation('/TransactionProcessing')}
            >
              Transaction history for Fiat
            </button>
          </div>

          <div className={styles.homeInner}  onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')}
             >
            <img 
              className={styles.frameChild} 
              alt="Dupay Animation" 
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" 
            />
          </div>

          <div className={styles.tabbarstabbars}>
            <div className={styles.div}>
              <div 
                className={styles.content12} 
              >
                <AssessmentIcon />
                <b className={styles.text}>Transaction</b>
              </div>
            </div>
            <div className={styles.div1} onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')}>
              <div className={styles.content11}              >
                <img 
                  className={styles.iconbase} 
                  alt="Dupay" 
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" 

                />
                <b className={styles.text}>Dupay</b>
              </div>
            </div>
            <div className={styles.div1}>
              <div 
                className={styles.content11}  
                onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn')}
              >
                <img 
                  className={styles.iconbase} 
                  alt="Profile" 
                  src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" 
                />
                <b className={styles.text}>Profile</b>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Transactions;
