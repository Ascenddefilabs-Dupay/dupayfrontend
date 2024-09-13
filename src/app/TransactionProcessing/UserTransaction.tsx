


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './UserTransaction.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDollarSign, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// // Define TypeScript interfaces for transaction and error
// interface Transaction {
//   transaction_id: string;
//   sender_mobile_number: string;
//   user_phone_number: string;
//   transaction_amount: string;
//   transaction_fee: string;
//   transaction_timestamp: string;
// }

// const UserTransaction: React.FC = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const [activeFilter, setActiveFilter] = useState<'amount' | 'date' | null>(null);
//   const [minAmount, setMinAmount] = useState<string>('');
//   const [maxAmount, setMaxAmount] = useState<string>('');
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const router = useRouter();

//   const [userID, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//         const sessionDataString = window.localStorage.getItem('session_data');
//         if (sessionDataString) {
//             const sessionData = JSON.parse(sessionDataString);
//             const storedUserId: string = sessionData.user_id;
//             setUserId(storedUserId);
//             console.log(storedUserId);
//             // console.log(sessionData.user_email);
//         } else {
//             // router.push('/Userauthentication/SignIn');
//         }
//     }
// }, [router]);

//   const userId = 'DupC0001';

//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get('http://transactionprocess-ind-255574993735.asia-south1.run.app/transactionprocessing_api/wallet-transactions/', {
//         params: { user_id: userId },
//       });
//       setTransactions(response.data.transactions);
//       setError(null);
//     } catch (err) {
//       setError('Error fetching transaction history.');
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   useEffect(() => {
//     if (transactions.length > 0) {
//       const filtered = transactions.filter(transaction => {
//         const amount = parseFloat(transaction.transaction_amount);
//         const transactionDate = new Date(transaction.transaction_timestamp);

//         const min = parseFloat(minAmount);
//         const max = parseFloat(maxAmount);
//         const start = new Date(startDate);
//         const end = new Date(endDate);

//         const withinAmountRange = (!minAmount || amount >= min) && (!maxAmount || amount <= max);
//         const withinDateRange = (!startDate || transactionDate >= start) && (!endDate || transactionDate <= end);

//         return withinAmountRange && withinDateRange;
//       });

//       setFilteredTransactions(filtered);
//     }
//   }, [minAmount, maxAmount, startDate, endDate, transactions]);

//   const toggleFilter = (filterType: 'amount' | 'date') => {
//     setActiveFilter((prevFilter) => (prevFilter === filterType ? null : filterType));
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Transaction History</h2>

//       <div className={styles.filters}>
//         <FontAwesomeIcon
//           icon={faDollarSign}
//           className={styles.filterIcon}
//           onClick={() => toggleFilter('amount')}
//           title="Amount Filter"
//         />
//         <FontAwesomeIcon
//           icon={faCalendarAlt}
//           className={styles.filterIcon}
//           onClick={() => toggleFilter('date')}
//           title="Date Filter"
//         />
//       </div>

//       {activeFilter === 'amount' && (
//         <div className={styles.amountFilters}>
//           <label>
//             Min Amount:
//             <input
//               type="number"
//               value={minAmount}
//               onChange={(e) => setMinAmount(e.target.value)}
//               placeholder="Enter min amount"
//             />
//           </label>
//           <label>
//             Max Amount:
//             <input
//               type="number"
//               value={maxAmount}
//               onChange={(e) => setMaxAmount(e.target.value)}
//               placeholder="Enter max amount"
//             />
//           </label>
//         </div>
//       )}

//       {activeFilter === 'date' && (
//         <div className={styles.dateFilters}>
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label>
//         </div>
//       )}

//       {error && <p className={styles.error}>{error}</p>}
//       {filteredTransactions.length > 0 ? (
//         <div className={styles.transactionList}>
//           {filteredTransactions.map((transaction) => {
//             const amount = parseFloat(transaction.transaction_amount);
//             return (
//               <div key={transaction.transaction_id} className={styles.transactionCard}>
//                 <h3 className={styles.transactionTitle}>Transaction ID: {transaction.transaction_id}</h3>
//                 <p className={styles.transactionDetail}><strong>Sender:</strong> {transaction.sender_mobile_number}</p>
//                 <p className={styles.transactionDetail}><strong>Receiver:</strong> {transaction.user_phone_number}</p>
//                 <p className={styles.transactionDetail}><strong>Amount:</strong> ${amount.toFixed(2)}</p>
//                 <p className={styles.transactionDetail}><strong>Fee:</strong> ${parseFloat(transaction.transaction_fee).toFixed(2)}</p>
//                 <p className={styles.transactionDetail}><strong>Timestamp:</strong> {new Date(transaction.transaction_timestamp).toLocaleString()}</p>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className={styles.noTransactions}>No transactions found for user ID: {userId}</p>
//       )}
//     </div>
//   );
// };

// export default UserTransaction;




// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import styles from './UserTransaction.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faDollarSign, faCalendarAlt, faInbox } from '@fortawesome/free-solid-svg-icons';

// // Define TypeScript interfaces for transaction and error
// interface Transaction {
//   transaction_id: string;
//   sender_mobile_number: string;
//   user_phone_number: string;
//   transaction_amount: string;
//   transaction_fee: string;
//   transaction_timestamp: string;
// }

// const UserTransaction: React.FC = () => {
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const [activeFilter, setActiveFilter] = useState<'amount' | 'date' | null>(null);
//   const [minAmount, setMinAmount] = useState<string>('');
//   const [maxAmount, setMaxAmount] = useState<string>('');
//   const [startDate, setStartDate] = useState<string>('');
//   const [endDate, setEndDate] = useState<string>('');
//   const router = useRouter();

//   const [userID, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const sessionDataString = window.localStorage.getItem('session_data');
//       if (sessionDataString) {
//         const sessionData = JSON.parse(sessionDataString);
//         const storedUserId: string = sessionData.user_id;
//         setUserId(storedUserId);
//         console.log(storedUserId);
//       } else {
//         // router.push('/Userauthentication/SignIn');
//       }
//     }
//   }, [router]);

//   const userId = 'DupC0002';  // Just an example user ID

//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get('http://127.0.0.1:8000/transactionprocessing_api/wallet-transactions/', {
//         params: { user_id: userId },
//       });
//       setTransactions(response.data.transactions);
//       setError(null);
//     } catch (err) {
//       setError('Error fetching transaction history.');
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   useEffect(() => {
//     if (transactions.length > 0) {
//       const filtered = transactions.filter((transaction) => {
//         const amount = parseFloat(transaction.transaction_amount);
//         const transactionDate = new Date(transaction.transaction_timestamp);

//         const min = parseFloat(minAmount);
//         const max = parseFloat(maxAmount);
//         const start = new Date(startDate);
//         const end = new Date(endDate);

//         const withinAmountRange = (!minAmount || amount >= min) && (!maxAmount || amount <= max);
//         const withinDateRange = (!startDate || transactionDate >= start) && (!endDate || transactionDate <= end);

//         return withinAmountRange && withinDateRange;
//       });

//       setFilteredTransactions(filtered);
//     }
//   }, [minAmount, maxAmount, startDate, endDate, transactions]);

//   const toggleFilter = (filterType: 'amount' | 'date') => {
//     setActiveFilter((prevFilter) => (prevFilter === filterType ? null : filterType));
//   };

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Transaction History</h2>

//       <div className={styles.filters}>
//         <FontAwesomeIcon
//           icon={faDollarSign}
//           className={styles.filterIcon}
//           onClick={() => toggleFilter('amount')}
//           title="Amount Filter"
//         />
//         <FontAwesomeIcon
//           icon={faCalendarAlt}
//           className={styles.filterIcon}
//           onClick={() => toggleFilter('date')}
//           title="Date Filter"
//         />
//       </div>

//       {activeFilter === 'amount' && (
//         <div className={styles.amountFilters}>
//           <label>
//             Min Amount:
//             <input
//               type="number"
//               value={minAmount}
//               onChange={(e) => setMinAmount(e.target.value)}
//               placeholder="Enter min amount"
//             />
//           </label>
//           <label>
//             Max Amount:
//             <input
//               type="number"
//               value={maxAmount}
//               onChange={(e) => setMaxAmount(e.target.value)}
//               placeholder="Enter max amount"
//             />
//           </label>
//         </div>
//       )}

//       {activeFilter === 'date' && (
//         <div className={styles.dateFilters}>
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </label>
//         </div>
//       )}

//       {error && <p className={styles.error}>{error}</p>}
//       {filteredTransactions.length > 0 ? (
//         <div className={styles.transactionList}>
//           {filteredTransactions.map((transaction) => {
//             const amount = parseFloat(transaction.transaction_amount);
//             return (
//               <div key={transaction.transaction_id} className={styles.transactionCard}>
//                 <h3 className={styles.transactionTitle}>Transaction ID: {transaction.transaction_id}</h3>
//                 <p className={styles.transactionDetail}><strong>Sender:</strong> {transaction.sender_mobile_number}</p>
//                 <p className={styles.transactionDetail}><strong>Receiver:</strong> {transaction.user_phone_number}</p>
//                 <p className={styles.transactionDetail}><strong>Amount:</strong> ${amount.toFixed(2)}</p>
//                 <p className={styles.transactionDetail}><strong>Fee:</strong> ${parseFloat(transaction.transaction_fee).toFixed(2)}</p>
//                 <p className={styles.transactionDetail}><strong>Timestamp:</strong> {new Date(transaction.transaction_timestamp).toLocaleString()}</p>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <div className={styles.emptyState}>
//           <FontAwesomeIcon icon={faInbox} className={styles.emptyIcon} />
//           <p className={styles.noTransactionsText}>No transactions found </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserTransaction;





'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './UserTransaction.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCalendarAlt, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

// Define TypeScript interfaces for transaction and error
interface Transaction {
  transaction_id: string;
  sender_mobile_number: string;
  user_phone_number: string;
  transaction_amount: string;
  transaction_fee: string;
  transaction_timestamp: string;
}

const UserTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<'amount' | 'date' | null>(null);
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const router = useRouter();

  const [userID, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      if (sessionDataString) {
        const sessionData = JSON.parse(sessionDataString);
        const storedUserId: string = sessionData.user_id;
        setUserId(storedUserId);
        console.log(storedUserId);
      } else {
        // router.push('/Userauthentication/SignIn');
      }
    }
  }, [router]);

  // const userId = 'DupC0001';  // Just an example user ID

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://transactionprocess-ind-255574993735.asia-south1.run.app/transactionprocessing_api/wallet-transactions/', {
        params: { user_id: userID },
      });
      setTransactions(response.data.transactions);
      setError(null);
    } catch (err) {
      setError('Error fetching transaction history.');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const filtered = transactions.filter((transaction) => {
        const amount = parseFloat(transaction.transaction_amount);
        const transactionDate = new Date(transaction.transaction_timestamp);

        const min = parseFloat(minAmount);
        const max = parseFloat(maxAmount);
        const start = new Date(startDate);
        const end = new Date(endDate);

        const withinAmountRange = (!minAmount || amount >= min) && (!maxAmount || amount <= max);
        const withinDateRange = (!startDate || transactionDate >= start) && (!endDate || transactionDate <= end);

        return withinAmountRange && withinDateRange;
      });

      setFilteredTransactions(filtered);
    }
  }, [minAmount, maxAmount, startDate, endDate, transactions]);

  const toggleFilter = (filterType: 'amount' | 'date') => {
    setActiveFilter((prevFilter) => (prevFilter === filterType ? null : filterType));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Transaction History</h2>

      <div className={styles.filters}>
        <FontAwesomeIcon
          icon={faDollarSign}
          className={styles.filterIcon}
          onClick={() => toggleFilter('amount')}
          title="Amount Filter"
        />
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className={styles.filterIcon}
          onClick={() => toggleFilter('date')}
          title="Date Filter"
        />
      </div>

      {activeFilter === 'amount' && (
        <div className={styles.amountFilters}>
          <label>
            Min Amount:
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Enter min amount"
            />
          </label>
          <label>
            Max Amount:
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Enter max amount"
            />
          </label>
        </div>
      )}

      {activeFilter === 'date' && (
        <div className={styles.dateFilters}>
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
      {filteredTransactions.length > 0 ? (
        <div className={styles.transactionList}>
          {filteredTransactions.map((transaction) => {
            const amount = parseFloat(transaction.transaction_amount);
            return (
              <div key={transaction.transaction_id} className={styles.transactionCard}>
                <h3 className={styles.transactionTitle}>Transaction ID: {transaction.transaction_id}</h3>
                <p className={styles.transactionDetail}><strong>Sender:</strong> {transaction.sender_mobile_number}</p>
                <p className={styles.transactionDetail}><strong>Receiver:</strong> {transaction.user_phone_number}</p>
                <p className={styles.transactionDetail}><strong>Amount:</strong> ${amount.toFixed(2)}</p>
                <p className={styles.transactionDetail}><strong>Fee:</strong> ${parseFloat(transaction.transaction_fee).toFixed(2)}</p>
                <p className={styles.transactionDetail}><strong>Timestamp:</strong> {new Date(transaction.transaction_timestamp).toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faBoxOpen} className={styles.emptyIcon} />
          <p className={styles.noTransactionsText}>No transactions found</p>
        </div>
      )}
    </div>
  );
};

export default UserTransaction;
