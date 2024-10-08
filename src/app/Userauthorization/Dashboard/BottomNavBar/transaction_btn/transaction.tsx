// "use client"
// import styles from './transaction.module.css';
// import { redirect } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { IconButton } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';


  


// const Transactions = () => {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isDupayOpen, setIsDupayOpen] = useState(false);
//   const router = useRouter();

//   const handleBackClick = () => {
//     setLoading(true); 
//     setTimeout(() => {
//         router.push('/Userauthorization/Dashboard/Home'); 
//     }, 500); 
// }; 

// const handleDupayClick = () => {
//   setIsDupayOpen(true); // Open the blur screen with buttons
//   };

//   const handleClose = () => {
//   setIsDupayOpen(false); // Close the blur screen
//   };

// const handleNavigation = (route: string) => {
//   setLoading(true); 
//   setTimeout(() => {
//     router.push(route); 
//     setLoading(true);
//   }, 2000);
// };

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const sessionDataString = window.localStorage.getItem('session_data');
//       // if (sessionDataString) {
//       //   const sessionData = JSON.parse(sessionDataString);
//       //   const storedUserId = sessionData.user_id;
//       //   setUserId(storedUserId);
//       //   console.log(storedUserId);
//       //   console.log(sessionData.user_email);
//       // } else {
//       //   redirect('http://localhost:3000/Userauthentication/SignIn');
//       // }
//     }
//   }, []);
//   return (
//     <div className={styles.container}>
//       {loading ? (
//         <div className={styles.loaderContainer}>
//           <div className={styles.loader}></div>
//         </div>
//       ) : (
//         <>
//           <center>
//             <h1 className={styles.title}>Transactions</h1>
         
//           <IconButton
//             className={styles.backarrow}
//             onClick={handleBackClick}
//             sx={{ color: 'white' }}
//           >
//             <ArrowBackIcon />
//           </IconButton>
//           </center>
//           {/* <body> */}
            
          
//           <div className={styles.noTransactions}>
//             <div>
//               <img
//                 className={styles.img}
//                 src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1724911805/transaction_image_swymyd.png"
//                 alt="transactions_image"
//               />
//             </div>
//             {/* Uncomment the following line if you need to display the title */}
//             {/* <h2 className={styles.noTransactionsTitle}>No transactions yet</h2> */}
//             <p className={styles.description}>
//               Your Crypto and Fiat activity will appear here
//             </p>
//             <p className={styles.description}>
//               once you start using your wallet.
//             </p>
//             <button className={styles.addButton}>Transaction history for Crypto</button>
//             <button
//               className={styles.tipsButton}
//               onClick={() => handleNavigation('/TransactionProcessing')}
//             >
//               Transaction history for Fiat
//             </button>
//           </div>

//           <div className={styles.homeInner} onClick={handleDupayClick}>
//             <img className={styles.frameChild} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" />
//         </div>
//             <div className={styles.tabbarstabbars}>          
//         				<div className={styles.div}>
//           					<div className={styles.content11} onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/transaction_btn')}>
//             						{/* <img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727076064/wallet_icon_ubkgg2.png" /> */}
//                         <AssessmentIcon />
//             						<b className={styles.text}>Transaction</b>
//           					</div>
//         				</div>
//         				<div className={styles.div1} onClick={handleDupayClick}>
//           					<div className={styles.content11} >
//             						<img className={styles.iconbase}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077435/payment_mbvqke.png" />
//             						<b className={styles.text}>Dupay</b>
//           					</div>
//         				</div>
//         				<div className={styles.div1}>
//           					<div className={styles.content11}  onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/profileicon_btn')}>
//             						<img className={styles.iconbase} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727077051/profileicon_logo_dxbyqc.png" />
//             						<b className={styles.text}>Profile</b>
//           					</div>
//         				</div>
//       			</div>
//         <div>
//         {isDupayOpen && (
//         <div className={styles.overlay}>
//           <div className={styles.blurBackground}></div>
//           <div className={styles.buttonsContainer}>
//             <div className={styles.button}    
//               onClick={() => handleNavigation('/Userauthorization/cashout_btn')}
//               >
//               <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085076/cashout_icon_h0h6vj.png" alt="Cashout" 
// 				style={{position: 'relative', right: '-5px'}}	  />
//               <span>Cashout</span>
//             </div>
//             <div className={styles.button}
//            onClick={() => handleNavigation('/Userauthorization/swap_btn')}
//               >
//               <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085724/swap_icon_v5uzcz.png" alt="Swap" 
// 			  style={{position: 'relative', right: '3px'}}
// 			  />
// 				<div style={{ fontFamily: 'Roboto, sans-serif' }}>Swap</div>
// 			</div>
//             <div className={styles.button}
//             onClick={() => handleNavigation('/Userauthorization/receive_btn')} >
//               <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085940/Receive_icon_kwgsaq.png" alt="Receive" 
// 			  style={{width:'20px', height: '20px', position: 'relative', right: '-15px'}}		  />
//               <div style={{ marginLeft: '20px', fontFamily: 'Roboto, sans-serif' }}>Receive</div>
//             </div>
//             <div className={styles.button}
//             onClick={() => handleNavigation('/Userauthorization/send_btn')}>
//               <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085858/Send_icon_zag3am.png" alt="Send" 
// 			  style={{width:'20px', height: '20px', position: 'relative', right: '4px'}}
// 			  />
//               <div style={{ fontFamily: 'Roboto, sans-serif' }}>Send</div>
//             </div>
//             <div className={styles.button}
//            onClick={() => handleNavigation('/WalletManagement/Transak')}  >
//               <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086014/Buy_icon_rwmfdq.png" alt="Buy" 
// 			 	style={{position: 'relative', right: '7px'}}			  />

//               <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', right: '7px'  }}>Buy</div>
//             </div>
//           </div>
//           {/* Close button */}
//           <button className={styles.closeButton1} onClick={handleClose}>
//             <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
//           </button>
//         </div>
//       )}
//           {/* </body> */}
//         </>
//       )}
//     </div>
//   );
// };

// export default Transactions;






"use client"
import styles from './transaction.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Transactions = () => {
  const [loading, setLoading] = useState(false);
  const [isDupayOpen, setIsDupayOpen] = useState(false);
  const router = useRouter();

  const handleBackClick = () => {
    setLoading(true); 
    setTimeout(() => {
      router.push('/Userauthorization/Dashboard/Home'); 
    }, 500); 
  }; 

  const handleDupayClick = () => {
    setIsDupayOpen(true); // Open the blur screen with buttons
  };

  const handleClose = () => {
    setIsDupayOpen(false); // Close the blur screen
  };
  
  const handleNavigation = (route: string) => {
    setLoading(true); 
    setTimeout(() => {
      router.push(route); 
    }, 2000);
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

          <div className={styles.homeInner} onClick={handleDupayClick}>
            <img 
              className={styles.frameChild} 
              alt="Dupay Animation" 
              src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727074312/DupayAnimation_iyxfli.png" 
            />
          </div>

          <div className={styles.tabbarstabbars}>
            <div className={styles.div}>
              <div 
                className={styles.content11} 
                onClick={() => handleNavigation('/Userauthorization/Dashboard/BottomNavBar/transaction_btn')}
              >
                <AssessmentIcon />
                <b className={styles.text}>Transaction</b>
              </div>
            </div>
            <div className={styles.div1} onClick={handleDupayClick}>
              <div className={styles.content11}>
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

          {isDupayOpen && (
              <div className={styles.overlay}>
                <div className={styles.blurBackground}></div>
                <div className={styles.buttonsContainer}>
                  <div className={styles.button}    
                    onClick={() => handleNavigation('/Userauthorization/cashout_btn')}
                    >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085076/cashout_icon_h0h6vj.png" alt="Cashout" 
              style={{position: 'relative', right: '-5px'}}	  />
                    <span>Cashout</span>
                  </div>
                  <div className={styles.button}
                onClick={() => handleNavigation('/Userauthorization/swap_btn')}
                    >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085724/swap_icon_v5uzcz.png" alt="Swap" 
              style={{position: 'relative', right: '3px'}}
              />
              <div style={{ fontFamily: 'Roboto, sans-serif' }}>Swap</div>
            </div>
                  <div className={styles.button}
                  onClick={() => handleNavigation('/Userauthorization/receive_btn')} >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085940/Receive_icon_kwgsaq.png" alt="Receive" 
              style={{width:'20px', height: '20px', position: 'relative', right: '-15px'}}		  />
                    <div style={{ marginLeft: '20px', fontFamily: 'Roboto, sans-serif' }}>Receive</div>
                  </div>
                  <div className={styles.button}
                  onClick={() => handleNavigation('/Userauthorization/send_btn')}>
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727085858/Send_icon_zag3am.png" alt="Send" 
              style={{width:'20px', height: '20px', position: 'relative', right: '4px'}}
              />
                    <div style={{ fontFamily: 'Roboto, sans-serif' }}>Send</div>
                  </div>
                  <div className={styles.button}
                onClick={() => handleNavigation('/WalletManagement/Transak')}  >
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086014/Buy_icon_rwmfdq.png" alt="Buy" 
              style={{position: 'relative', right: '7px'}}			  />

                    <div style={{ fontFamily: 'Roboto, sans-serif', position: 'relative', right: '7px'  }}>Buy</div>
                  </div>
                </div>
                {/* Close button */}
                <button className={styles.closeButton1} onClick={handleClose}>
                  <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727086180/close_icon_acudos.png" alt="Close" />
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Transactions;
