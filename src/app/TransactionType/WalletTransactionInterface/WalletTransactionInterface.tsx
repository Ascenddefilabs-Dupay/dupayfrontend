// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import './WalletTransaction.css'; // Add this for styling
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const WalletTransaction = () => {
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const router = useRouter();

//   const handlePaymentMethodChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleNextClick = () => {
//     if (paymentMethod === 'number') {
//       router.push('/TransactionType/WalletTransactions');
//     } else if (paymentMethod === 'qrcode') {
//       router.push('/TransactionType/QrScanner');
//     } else if (paymentMethod === 'walletAddress') {
//       router.push('/TransactionType/AddressBasedTransaction');
//     }
//   };

//   const handleBackClick = () => {
//     let redirectUrl = '/Userauthorization/Dashboard';
//     router.push(redirectUrl);
//   };

//   return (
//     <div className="wallet-transaction">
//       <div className='back_container'>
//         <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
//         <h2 className='wallet-transaction_heading'>Wallet Transaction</h2>
//       </div>
//       <div className="form-group">
//         <label htmlFor="payment-method">Select Payment Method:</label>
//         <select
//           id="payment-method"
//           value={paymentMethod}
//           onChange={handlePaymentMethodChange}
//         >
//           <option value="">--Choose a method--</option>
//           <option value="number">Through Number</option>
//           <option value="qrcode">Through QR Code</option>
//           <option value="walletAddress">Through Wallet Address</option>
//         </select>
//       </div>
//       <button onClick={handleNextClick} disabled={!paymentMethod} className='button_class'>
//         Next
//       </button>
//     </div>
//   );
// };

// export default WalletTransaction;

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import './WalletTransaction.css'; // Add this for styling
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const WalletTransaction = () => {
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [showLoader, setShowLoader] = useState(false);
//   const router = useRouter();

//   const handlePaymentMethodChange = (event) => {
//     setPaymentMethod(event.target.value);
//   };

//   const handleNextClick = () => {
//     if (!paymentMethod) return;

//     setShowLoader(true);

//     setTimeout(() => {
//       setShowLoader(false);

//       if (paymentMethod === 'number') {
//         router.push('/TransactionType/WalletTransactions');
//       } else if (paymentMethod === 'qrcode') {
//         router.push('/TransactionType/QrScanner');
//       } else if (paymentMethod === 'walletAddress') {
//         router.push('/TransactionType/AddressBasedTransaction');
//       }
//     }, 1000); // 2 seconds delay
//   };

//   const handleBackClick = () => {
//     setShowLoader(true);

//     setTimeout(() => {
//       setShowLoader(false);
//       router.push('/Userauthorization/Dashboard');
//     }, 2000); // 2 seconds delay
//   };

//   return (
//     <div className="wallet-transaction">
//       <div className='back_container'>
//         {showLoader ? (
//           <div className="loaderContainer">
//             <div className="loader"></div>
//           </div>
//         ) : (
//           <>
//             <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
//             <h2 className='wallet-transaction_heading'>Wallet Transaction</h2>
//           </>
//         )}
//       </div>

//       {!showLoader && (
//         <div className="form-group">
//           <label htmlFor="payment-method">Select Payment Method:</label>
//           <select
//             id="payment-method"
//             value={paymentMethod}
//             onChange={handlePaymentMethodChange}
//           >
//             <option value="">--Choose a method--</option>
//             <option value="number">Through Number</option>
//             <option value="qrcode">Through QR Code</option>
//             <option value="walletAddress">Through Wallet Address</option>
//           </select>
//         </div>
//       )}
//       {!showLoader && (
//         <button onClick={handleNextClick} disabled={!paymentMethod} className='button_class'>
//           Next
//         </button>
//       )}
//     </div>
//   );
// };

// export default WalletTransaction;



import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import './WalletTransaction.css'; // Add this for styling
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const WalletTransaction: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const router = useRouter();

  const handlePaymentMethodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(event.target.value);
  };

  const handleNextClick = () => {
    if (!paymentMethod) return;

    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);

      if (paymentMethod === 'number') {
        router.push('/TransactionType/WalletTransactions');
      } else if (paymentMethod === 'qrcode') {
        router.push('/TransactionType/QrScanner');
      } else if (paymentMethod === 'walletAddress') {
        router.push('/TransactionType/AddressBasedTransaction');
      }
    }, 1000); // 1 second delay
  };

  const handleBackClick = () => {
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      router.push('/Userauthorization/Dashboard');
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="wallet-transaction">
      <div className='back_container'>
        {showLoader ? (
          <div className="loaderContainer">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <ArrowBackIcon className="setting_back_icon" onClick={handleBackClick} />
            <h2 className='wallet-transaction_heading'>Wallet Transaction</h2>
          </>
        )}
      </div>

      {!showLoader && (
        <div className="form-group">
          <label htmlFor="payment-method">Select Payment Method:</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
          >
            <option value="">--Choose a method--</option>
            <option value="number">Through Number</option>
            <option value="qrcode">Through QR Code</option>
            <option value="walletAddress">Through Wallet Address</option>
          </select>
        </div>
      )}
      {!showLoader && (
        <button onClick={handleNextClick} disabled={!paymentMethod} className='button_class'>
          Next
        </button>
      )}
    </div>
  );
};

export default WalletTransaction;
