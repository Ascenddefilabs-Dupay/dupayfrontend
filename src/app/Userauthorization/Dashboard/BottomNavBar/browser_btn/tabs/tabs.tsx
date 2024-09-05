'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './tabs.module.css';
import { redirect } from 'next/navigation';


const Tabs = () => {
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
  const [tabs, setTabs] = useState([
    { id: 1, title: 'Google', url: 'https://www.google.com' },
    { id: 2, title: 'YouTube', url: 'https://www.youtube.com' },
    { id: 3, title: 'GitHub', url: 'https://www.github.com' },
  ]);

  // Update tab count when tabs are modified
  useEffect(() => {
    // You can add any effect if needed for tab count changes
  }, [tabs]);

  const handleBack = () => {
    const tabCount = tabs.length;
    // Navigate back to Browser with tab count
    router.push(`/Userauthorization/Dashboard/BottomNavBar/browser_btn?tabCount=${tabCount}`);
  };

  const handleTabClick = (url: string) => {
    router.push(url);
  };

  const handleCloseTab = (id: number) => {
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  type Tab = {
    id: number; // Or string, depending on your use case
    title: string;
  };

  const handleAddTab = () => {
    const newId = tabs.length ? tabs[tabs.length - 1].id + 1 : 1;
    const newTab = { id: newId, title: `New Tab ${newId}`, url: 'https://www.example.com' };
    setTabs([...tabs, newTab]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button onClick={handleBack} className={styles.iconButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className={styles.header}>Tabs</h1>
        <button onClick={handleAddTab} className={styles.addButton}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className={styles.tabList}>
      {tabs.map(tab => (
          <div key={tab.id} className={styles.tabItem}>
            <div onClick={() => handleTabClick(tab.url)} className={styles.tabContent}>
              <p className={styles.title}>{tab.title}</p>
              <p className={styles.url}>{tab.id}</p>
            </div>
            <button onClick={() => handleCloseTab(tab.id)} className={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
