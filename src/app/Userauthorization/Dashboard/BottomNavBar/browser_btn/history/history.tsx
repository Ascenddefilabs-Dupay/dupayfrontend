'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './history.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { redirect } from 'next/navigation';


const History = () => {
  const router = useRouter();
  // const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // const storedUserId = localStorage.getItem('user_id');
      // setUserId(storedUserId);
      // setAlertMessage('User Need To Login')
      // if (storedUserId === null) redirect('http://localhost:3000/');
      // console.log(storedUserId)
      // console.log(userId);
    }
  }, []);
  const [historyItems, setHistoryItems] = useState([
    // Sample history items
    { id: 1, title: 'Google', url: 'https://www.google.com' },
    { id: 2, title: 'YouTube', url: 'https://www.youtube.com' },
    { id: 3, title: 'GitHub', url: 'https://www.github.com' },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleHistoryItemClick = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      try {
        router.push(url);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };
  
  
  

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button onClick={handleBack} className={styles.iconButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className={styles.header}>History</h1>
      </div>
      <div className={styles.historyList}>
        {historyItems.map((item) => (
          <div
            key={item.id}
            className={styles.historyItem}
            onClick={() => handleHistoryItemClick(item.url)}
          >
            <p className={styles.title}>{item.title}</p>
            <p className={styles.url}>{item.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
