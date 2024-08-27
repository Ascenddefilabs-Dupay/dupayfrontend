// "use client";
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { RiBankLine } from "react-icons/ri";
// import { PiHandDepositBold } from "react-icons/pi";
// import { PiHandWithdrawBold } from "react-icons/pi";
// import { IoMdSend } from "react-icons/io";
// import { IoMdWallet } from "react-icons/io";
// import styles from './fiatwallet.module.css'; // Separate CSS file

// const FiatWallet = () => {
//   const router = useRouter();

//   const handleButtonClick = (buttonName) => {
//     switch (buttonName) {
//       case 'Add Bank':
//         router.push('/Userauthorization/Dashboard/fiatwallet/addbank_btn');
//         break;
//       case 'Deposit':
//         router.push('/Userauthorization/Dashboard/fiatwallet/deposit_btn');
//         break;
//       case 'Withdraw':
//         router.push('/Userauthorization/Dashboard/fiatwallet/withdraw_btn');
//         break;
//       case 'Send':
//         router.push('/Userauthorization/Dashboard/fiatwallet/send_btn');
//         break;
//       case 'Top-up':
//         router.push('/Userauthorization/Dashboard/fiatwallet/top-up_btn');
//         break;
//       default:
//         console.log('No route defined for this button');
//     }
//   };

//   const navigateToDashboard = () => {
//     router.push('/Userauthorization/Dashboard');
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <button onClick={navigateToDashboard} className={styles.backButton}>
//           <ArrowBackIcon />
//         </button>
//         <h1 className={styles.title}>Fiat Wallet</h1>
//       </div>
//       <div className={styles.buttonContainer}>
//         <button 
//           className={styles.walletButton} 
//           onClick={() => handleButtonClick('Add Bank')}
//         >
//           <RiBankLine className={styles.icon} />
//           <div className={styles.buttonLabel}>Add Bank</div>
//         </button>
//         <button 
//           className={styles.walletButton} 
//           onClick={() => handleButtonClick('Deposit')}
//         >
//           <PiHandDepositBold className={styles.icon} />
//           <div className={styles.buttonLabel}>Deposit</div>
//         </button>
//         <button 
//           className={styles.walletButton} 
//           onClick={() => handleButtonClick('Withdraw')}
//         >
//           <PiHandWithdrawBold className={styles.icon} />
//           <div className={styles.buttonLabel}>Withdraw</div>
//         </button>
//         <button 
//           className={styles.walletButton} 
//           onClick={() => handleButtonClick('Send')}
//         >
//           <IoMdSend className={styles.icon} />
//           <div className={styles.buttonLabel}>Send</div>
//         </button>
//         <button 
//           className={styles.walletButton} 
//           onClick={() => handleButtonClick('Top-up')}
//         >
//           <IoMdWallet className={styles.icon} />
//           <div className={styles.buttonLabel}>Top-up</div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FiatWallet;







"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { RiBankLine } from "react-icons/ri";
import { PiHandDepositBold } from "react-icons/pi";
import { PiHandWithdrawBold } from "react-icons/pi";
import { IoMdSend } from "react-icons/io";
import { IoMdWallet } from "react-icons/io";
import styles from './fiatwallet.module.css'; // Separate CSS file

const FiatWallet = () => {
  const router = useRouter();

  const handleButtonClick = (buttonName) => {
    switch (buttonName) {
      case 'Add Bank':
        // router.push('/Userauthorization/Dashboard/fiatwallet/addbank_btn');
        window.location.href = '/FiatManagement/AddBanks';
        break;
      case 'Deposit':
        // router.push('/Userauthorization/Dashboard/fiatwallet/deposit_btn');
        window.location.href = '/FiatManagement/DepositForm';   
        break;
      case 'Withdraw':
        // router.push('/Userauthorization/Dashboard/fiatwallet/withdraw_btn');
        window.location.href = '/FiatManagement/WithdrawForm';
        break;
      case 'Send':
        // router.push('/Userauthorization/Dashboard/fiatwallet/send_btn');
        window.location.href = '/TransactionType/WalletTransactionInterface';
        break;
      case 'Top-up':
        router.push('/FiatManagement/top-up_btn');
        break;
      default:
        console.log('No route defined for this button');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.walletButton} 
          onClick={() => handleButtonClick('Add Bank')}
        >
          <RiBankLine className={styles.icon} />
          <div className={styles.buttonLabel}>Add Bank</div>
        </button>
        <button 
          className={styles.walletButton} 
          onClick={() => handleButtonClick('Deposit')}
        >
          <PiHandDepositBold className={styles.icon} />
          <div className={styles.buttonLabel}>Deposit</div>
        </button>
        <button 
          className={styles.walletButton} 
          onClick={() => handleButtonClick('Withdraw')}
        >
          <PiHandWithdrawBold className={styles.icon} />
          <div className={styles.buttonLabel}>Withdraw</div>
        </button>
        <button 
          className={styles.walletButton} 
          onClick={() => handleButtonClick('Send')}
        >
          <IoMdSend className={styles.icon} />
          <div className={styles.buttonLabel}>Send</div>
        </button>
        <button 
          className={styles.walletButton} 
          onClick={() => handleButtonClick('Top-up')}
        >
          <IoMdWallet className={styles.icon} />
          <div className={styles.buttonLabel}>Top-up</div>
        </button>
      </div>
    </div>
  );
};

export default FiatWallet;
