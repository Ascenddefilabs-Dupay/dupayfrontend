

// 'use client';

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import styles from './UserTransaction.module.css';

// const UserTransaction = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [filteredTransactions, setFilteredTransactions] = useState([]);
//   const [error, setError] = useState(null);

//   const [showAmountFilters, setShowAmountFilters] = useState(false);
//   const [showDateFilters, setShowDateFilters] = useState(false);
//   const [minAmount, setMinAmount] = useState('');
//   const [maxAmount, setMaxAmount] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');

//   // Hardcoded user ID
//   const userId = 'DupC0001';

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
//     // Filter transactions based on amount and date range
//     if (transactions.length > 0) {
//       const filtered = transactions.filter(transaction => {
//         const amount = parseFloat(transaction.transaction_amount);
//         const fee = parseFloat(transaction.transaction_fee);
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

//   return (
//     <div className={styles.container}>
//       <h2 className={styles.title}>Transaction History for User ID: {userId}</h2>

//       <div className={styles.filters}>
//         <button
//           className={styles.filterButton}
//           onClick={() => setShowAmountFilters(!showAmountFilters)}
//         >
//           {showAmountFilters ? 'Hide Amount Filter' : 'Amount Filter'}
//         </button>
//         {showAmountFilters && (
//           <div className={styles.amountFilters}>
//             <label>
//               Min Amount:
//               <input
//                 type="number"
//                 value={minAmount}
//                 onChange={(e) => setMinAmount(e.target.value)}
//                 placeholder="Enter min amount"
//               />
//             </label>
//             <label>
//               Max Amount:
//               <input
//                 type="number"
//                 value={maxAmount}
//                 onChange={(e) => setMaxAmount(e.target.value)}
//                 placeholder="Enter max amount"
//               />
//             </label>
//           </div>
//         )}

//         <button
//           className={styles.filterButton}
//           onClick={() => setShowDateFilters(!showDateFilters)}
//         >
//           {showDateFilters ? 'Hide Date Filter' : 'Date Filter'}
//         </button>
//         {showDateFilters && (
//           <div className={styles.dateFilters}>
//             <label>
//               Start Date:
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//               />
//             </label>
//             <label>
//               End Date:
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </label>
//           </div>
//         )}
//       </div>

//       {error && <p className={styles.error}>{error}</p>}
//       {filteredTransactions.length > 0 ? (
//         <div className={styles.transactionList}>
//           {filteredTransactions.map((transaction) => {
//             const amount = parseFloat(transaction.transaction_amount);
//             const fee = parseFloat(transaction.transaction_fee);

//             return (
//               <div key={transaction.transaction_id} className={styles.transactionCard}>
//                 <h3 className={styles.transactionTitle}>Transaction ID: {transaction.transaction_id}</h3>
//                 <p className={styles.transactionDetail}><strong>Sender:</strong> {transaction.sender_mobile_number}</p>
//                 <p className={styles.transactionDetail}><strong>Receiver:</strong> {transaction.user_phone_number}</p>
//                 <p className={styles.transactionDetail}><strong>Amount:</strong> ${amount.toFixed(2)}</p>
//                 <p className={styles.transactionDetail}><strong>Fee:</strong> ${fee.toFixed(2)}</p>
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


'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserTransaction.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const UserTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState(null); // 'amount' or 'date'
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const userId = 'DupC0001';

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/transactionprocessing_api/wallet-transactions/', {
        params: { user_id: userId },
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
      const filtered = transactions.filter(transaction => {
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

  const toggleFilter = (filterType) => {
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
        <p className={styles.noTransactions}>No transactions found for user ID: {userId}</p>
      )}
    </div>
  );
};

export default UserTransaction;
