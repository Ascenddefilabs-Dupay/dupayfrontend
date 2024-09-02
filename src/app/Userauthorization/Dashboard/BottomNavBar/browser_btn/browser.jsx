'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faEllipsisV, faWindowRestore, faHome, faChevronLeft, faChevronRight, faClock, faBookmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './browser.module.css';
import { useState } from 'react';

const Browser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabCount = parseInt(searchParams.get('tabCount')) || 0; // Get tab count from URL params
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false); // Initialize showDropdown state
  const [searchResults, setSearchResults] = useState([]); // State for search results

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

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      window.open(searchUrl, '_blank'); // Open in a new tab
      setSearchResults([]); // Reset search results
      setSearchQuery(''); // Clear search input
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
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
          />
        </form>
        <div className={styles.iconButton}  >
        <button >
          <FontAwesomeIcon icon={faGlobe} style={{position: 'relative', left: '10px'}}/>
        </button>
        </div>
        <div className={styles.tabs} onClick={handleOpenNewTab}>
          <FontAwesomeIcon icon={faPlus} style={{position: 'relative', left: '10px', color: 'white', fontSize: '14px'}}/>
          <span className={styles.tabCount} style={{position: 'relative', left: '10px'}}>{tabCount}</span>
        </div>
        <button onClick={toggleDropdown} className={styles.iconButton}>
          <FontAwesomeIcon icon={faEllipsisV} style={{position: 'relative', left: '30px'}}/>
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
