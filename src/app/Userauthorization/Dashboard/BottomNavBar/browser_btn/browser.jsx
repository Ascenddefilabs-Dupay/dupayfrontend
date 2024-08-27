// 'use client';

// import { useRouter } from 'next/navigation';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faGlobe, faEllipsisV, faWindowRestore, faHome, faChevronLeft, faChevronRight, faClock, faBookmark, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
// import styles from './browser.module.css';
// import { useState } from 'react';

// const Browser = () => {
//   const router = useRouter();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [tabCount, setTabCount] = useState(3); // Example tab count

//   const handleBack = () => {
//     router.back();
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleOpenNewTab = () => {
//     setTabCount(tabCount + 1);
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.navbar}>
//         <button onClick={handleBack} className={styles.iconButton}>
//           <FontAwesomeIcon icon={faArrowLeft} />
//         </button>
//         <input
//           type="text"
//           placeholder="Search or type URL"
//           className={styles.searchInput}
//         />
//         <button className={styles.iconButton}>
//           <FontAwesomeIcon icon={faGlobe} style={{position: 'relative', left: '15px'}}/>
//         </button>
//         <div className={styles.tabs} onClick={handleOpenNewTab}>
//           <FontAwesomeIcon icon={faLayerGroup} style={{position: 'relative', left: '20px'}}/>
//           <span className={styles.tabCount} style={{position: 'relative', left: '20px'}}>{tabCount }</span>
//         </div>
//         <button onClick={toggleDropdown} className={styles.iconButton}>
//           <FontAwesomeIcon icon={faEllipsisV} style={{position: 'relative', left: '20px'}}/>
//         </button>
//         {showDropdown && (
//           <div className={styles.dropdown}>
//             <div className={styles.iconContainer}>
//               <div className={styles.iconWrapper}>
//                 <FontAwesomeIcon icon={faChevronLeft} className={styles.dropdownIcon} />
//               </div>
//               <div className={styles.iconWrapper}>
//                 <FontAwesomeIcon icon={faChevronRight} className={styles.dropdownIcon} />
//               </div>
//               <div className={styles.iconWrapper}>
//                 <FontAwesomeIcon icon={faHome} className={styles.dropdownIcon} />
//               </div>
//             </div>

//             <div className={styles.dropdownItem}>
//               <FontAwesomeIcon icon={faWindowRestore} className={styles.dropdownIcon} /> Tabs
//             </div>
//             <div className={styles.dropdownItem}>
//               <button>
//               <FontAwesomeIcon icon={faBookmark} className={styles.dropdownIcon} /> Bookmarks
//               </button>
//                           </div>
//             <div className={styles.dropdownItem}>
//               <FontAwesomeIcon icon={faClock} className={styles.dropdownIcon} /> History
//             </div>
//           </div>
//         )}
//       </div>
//       <h1 className={styles.header}></h1>
//       <div className={styles.contentBox}>
//         <p className={styles.text}></p>
//       </div>
//     </div>
//   );
// };

// export default Browser;




'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGlobe, faEllipsisV, faWindowRestore, faHome, faChevronLeft, faChevronRight, faClock, faBookmark, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import styles from './browser.module.css';
import { useState } from 'react';

const Browser = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabCount, setTabCount] = useState(1); // Example tab count

  const handleBack = () => {
    router.back();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOpenNewTab = () => {
    setTabCount(tabCount + 1);
  };

  const handleBookmarksClick = () => {
    router.push('/Userauthorization/Dashboard/BottomNavBar/browser_btn/bookmarks'); // Adjust the path based on your routing structure
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <button onClick={handleBack} className={styles.iconButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <input
          type="text"
          placeholder="Search or type URL"
          className={styles.searchInput}
        />
        <button className={styles.iconButton}>
          <FontAwesomeIcon icon={faGlobe} style={{position: 'relative', left: '15px'}}/>
        </button>
        <div className={styles.tabs} onClick={handleOpenNewTab}>
          <FontAwesomeIcon icon={faLayerGroup} style={{position: 'relative', left: '20px'}}/>
          <span className={styles.tabCount} style={{position: 'relative', left: '20px'}}>{tabCount }</span>
        </div>
        <button onClick={toggleDropdown} className={styles.iconButton}>
          <FontAwesomeIcon icon={faEllipsisV} style={{position: 'relative', left: '20px'}}/>
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
                <FontAwesomeIcon icon={faHome} className={styles.dropdownIcon} />
              </div>
            </div>

            <div className={styles.dropdownItem}>
              <FontAwesomeIcon icon={faWindowRestore} className={styles.dropdownIcon} /> Tabs
            </div>
            <div className={styles.dropdownItem}>
              <button onClick={handleBookmarksClick}>
                <FontAwesomeIcon icon={faBookmark} className={styles.dropdownIcon} /> Bookmarks
              </button>
            </div>
            <div className={styles.dropdownItem}>
              <FontAwesomeIcon icon={faClock} className={styles.dropdownIcon} /> History
            </div>
          </div>
        )}
      </div>
      <h1 className={styles.header}></h1>
      <div className={styles.contentBox}>
        <p className={styles.text}></p>
      </div>
    </div>
  );
};

export default Browser;
