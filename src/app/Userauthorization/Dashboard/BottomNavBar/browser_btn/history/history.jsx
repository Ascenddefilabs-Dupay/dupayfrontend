'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './history.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const History = () => {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState([
    // Sample history items
    { id: 1, title: 'Google', url: 'https://www.google.com' },
    { id: 2, title: 'YouTube', url: 'https://www.youtube.com' },
    { id: 3, title: 'GitHub', url: 'https://www.github.com' },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleHistoryItemClick = (url) => {
    router.push(url);
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
