'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent } from 'react';
import { faArrowLeft, faGlobe, faEllipsisV, faWindowRestore, faHome, faChevronLeft, faChevronRight, faClock, faBookmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './browser.module.css';
import { redirect } from 'next/navigation';


const Browser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize tabCount with default value of 0
  const [tabCount, setTabCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionDataString = window.localStorage.getItem('session_data');
      // if (sessionDataString) {
      //   const sessionData = JSON.parse(sessionDataString);
      //   const storedUserId = sessionData.user_id;
      //   setUserId(storedUserId);
      //   console.log(storedUserId);
      //   console.log(sessionData.user_email);
      // } else {
      //   redirect('http://localhost:3000/Userauthentication/SignIn');
      // }
    }
  }, []);

  useEffect(() => {
    if (searchParams) {
      const tabCountParam = searchParams.get('tabCount'); // Get tabCount as a string
      console.log('Search Params:', searchParams);
      console.log('Tab Count Param:', tabCountParam);
      
      // Parse the tab count and set the state
      const parsedTabCount = tabCountParam ? parseInt(tabCountParam, 10) : 0;
      if (!isNaN(parsedTabCount)) {
        setTabCount(parsedTabCount);
      } else {
        console.error('Invalid tabCount parameter:', tabCountParam);
        setTabCount(0);
      }
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleBack = () => {
    router.back();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOpenNewTab = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn/tabs');
  };

  const handleBookmarksClick = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn/bookmarks');
  };

  const handleHome = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn');
  };

  const handleHistoryClick = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn/history');
  };

  const handleTabsClick = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn/tabs');
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission action
  
    // Check if searchQuery is not empty
    if (searchQuery.trim()) {
      // Construct the search URL
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`;
      
      // Open the search URL in a new tab
      window.open(searchUrl, '_blank');
      
      // Clear search results and search query
      setSearchResults([]);
      setSearchQuery('');
    } else {
      // Optional: Handle the case where the search query is empty
      console.warn('Search query is empty. Please enter a search term.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button onClick={handleBack} className={styles.iconButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search or type URL"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className={styles.iconButton}>
          <button>
            <FontAwesomeIcon icon={faGlobe} style={{ position: 'relative', left: '10px' }} />
          </button>
        </div>
        <div className={styles.tabs} onClick={handleOpenNewTab}>
          <FontAwesomeIcon icon={faPlus} style={{ position: 'relative', left: '10px', color: 'white', fontSize: '14px' }} />
          <span className={styles.tabCount} style={{ position: 'relative', left: '10px' }}>{tabCount}</span>
        </div>
        <button onClick={toggleDropdown} className={styles.iconButton}>
          <FontAwesomeIcon icon={faEllipsisV} style={{ position: 'relative', left: '30px' }} />
        </button>
        {showDropdown && (
          <div className={styles.dropdown}>
            <div className={styles.iconContainer}>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faChevronLeft} className={styles.dropdownIcon} />
              </div>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faChevronRight} className={styles.dropdownIcon} />
              </div>
              <div className={styles.iconWrapper}>
                <FontAwesomeIcon icon={faHome} onClick={handleHome} className={styles.dropdownIcon} />
              </div>
            </div>

            <div className={styles.dropdownItem}>
              <button onClick={handleTabsClick}>
                <FontAwesomeIcon icon={faWindowRestore} className={styles.dropdownIcon} /> Tabs
              </button>
            </div>
            <div className={styles.dropdownItem}>
              <button onClick={handleBookmarksClick}>
                <FontAwesomeIcon icon={faBookmark} className={styles.dropdownIcon} /> Bookmarks
              </button>
            </div>
            <div className={styles.dropdownItem}>
              <button onClick={handleHistoryClick}>
                <FontAwesomeIcon icon={faClock} className={styles.dropdownIcon} /> History
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.contentBox}>
        <h1 className={styles.header}>Search Results</h1>
        <div className={styles.results}>
          {searchResults.length === 0 && <p>No results found. Try searching for something!</p>}
          {/* You can display your search results here */}
        </div>
      </div>
    </div>
  );
};

export default Browser;
