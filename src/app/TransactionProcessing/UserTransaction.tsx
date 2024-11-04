'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './UserTransaction.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faCalendarAlt, faDollarSign, faClock, faArrowDown, faArrowUp, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

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
  const [filterMenuVisible, setFilterMenuVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'amount' | 'date' | null>(null);
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [userID, setUserId] = useState<string | null>(null);

  const router = useRouter();
  // const userID = 'DupC0008'; // Example user ID


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

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('https://transactionprocessing-ind-255574993735.asia-south1.run.app/transactionprocessing_api/wallet-transactions/', {
        params: { user_id: userID },
      });
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions); // Set initial filtered transactions
      setError(null);
    } catch (err) {
      console.log('Error fetching transaction history.');
    }
  };
  useEffect(() => {
    if (userID) {
      fetchTransactions();
    }
  }, [userID]);

  useEffect(() => {
    filterTransactions();
  }, [minAmount, maxAmount, startDate, endDate, transactions]);

  const filterTransactions = () => {
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
  };

  const toggleFilterMenu = () => {
    setFilterMenuVisible(!filterMenuVisible);
  };

  const handleFilterIconClick = (filterType: 'amount' | 'date') => {
    if (filterType === 'amount') {
      setActiveFilter('amount');
      setMinAmount(''); // Reset min amount when switching filters
      setMaxAmount(''); // Reset max amount when switching filters
    } else {
      setActiveFilter('date');
      setStartDate(''); // Reset start date when switching filters
      setEndDate(''); // Reset end date when switching filters
    }
    setFilterMenuVisible(false); // Close filter menu
  };

  const handleBackClick = () => {
    router.push('/Userauthorization/Dashboard/Home');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727067208/1826c340-1853-453d-9ad0-6cafb099b947.png" alt="Back" />
        </button>
        <h2 className={styles.title}>Transaction History</h2>

        {/* 3-dots menu for filters */}
        <div className={styles.menuWrapper}>
          <FontAwesomeIcon icon={faEllipsisV} onClick={toggleFilterMenu} className={styles.menuIcon} />
          {filterMenuVisible && (
            <div className={styles.filterMenu}>
              <FontAwesomeIcon
                icon={faCalendarAlt}
                onClick={() => handleFilterIconClick('date')}
                className={styles.filterIcon}
                title="Date Filter"
              />
              <FontAwesomeIcon
                icon={faDollarSign}
                onClick={() => handleFilterIconClick('amount')}
                className={styles.filterIcon}
                title="Amount Filter"
              />
            </div>
          )}
        </div>
      </div>

      {/* Filters section */}
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

      {/* Transactions list */}
      {error && <p className={styles.error}>{error}</p>}

      {filteredTransactions.length > 0 ? (
        <div className={styles.transactionList}>
          {filteredTransactions.map((transaction) => {
            const amount = parseFloat(transaction.transaction_amount);
            const isReceived = transaction.sender_mobile_number !== userID;

            return (
              <div key={transaction.transaction_id} className={styles.transactionCard}>
                <div className={styles.transactionHeader}>
                  <FontAwesomeIcon
                    icon={isReceived ? faArrowDown : faArrowUp}
                    className={isReceived ? styles.iconReceived : styles.iconSent}
                  />
                  <div className={styles.transactionInfo}>
                    <p className={styles.transactionName}>
                      {isReceived ? 'Received from' : 'Sent to'}: {isReceived ? transaction.sender_mobile_number : transaction.user_phone_number}
                    </p>
                    <p className={styles.transactionTimestamp}>
                      <FontAwesomeIcon icon={faClock} /> {new Date(transaction.transaction_timestamp).toLocaleString()}
                    </p>
                  </div>  
                  <p className={`${styles.transactionAmount} ${isReceived ? styles.receivedAmount : styles.sentAmount}`}>
                    ${amount.toFixed(2)}
                  </p>
                </div>
                <div className={styles.transactionFooter}>
                  <p className={styles.transactionDetail}>Fee: ${parseFloat(transaction.transaction_fee).toFixed(2)}</p>
                </div>
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
