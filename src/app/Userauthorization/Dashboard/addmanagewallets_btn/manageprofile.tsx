// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import { IconButton } from '@mui/material';
// import { FaUserCircle } from 'react-icons/fa';
// import { BiImport } from 'react-icons/bi';
// import { useRouter } from 'next/navigation';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AddIcon from '@mui/icons-material/Add';
// import FolderIcon from '@mui/icons-material/Folder';
// import PlugIcon from '@mui/icons-material/Power';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import styles from './manageprofile.module.css';

// const ManageProfile = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay
//     return () => clearTimeout(timer);
//   }, []);

//   const handleNavigation = useCallback((path, timeout = 1000) => {
//     setLoading(true);
//     setTimeout(() => {
//       router.push(path);
//       setLoading(false);
//     }, timeout);
//   }, [router]);

//   return (
//     <div className="container">
//       {loading ? (
//         <div className={styles.loaderContainer}>
//           <div className={styles.loader}></div>
//         </div>
//       ) : (
//         <>
//           <div className="titleContainer">
//             <IconButton className="backarrow" onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')} sx={{ color: '#fff' }}>
//               <ArrowBackIcon />
//             </IconButton>
//             <h1 className="title">Add & manage wallets</h1>
//           </div>
//           <div className="section">
//             <h2 className="sectionTitle">WALLET 1</h2>
//             <button className="button" onClick={() => handleNavigation('/Manageprofile/ViewProfile')}>
//               <div className="walletItem">
//                 <FaUserCircle className="profileIcon" />
//                 <div className="walletInfo">
//                   <div className="walletAddress">srinivass7420.cb.id</div>
//                   <div className="walletBalance">$0.00</div>
//                 </div>
//                 <ArrowForwardIosIcon className="arrowIcon" />
//               </div>
//             </button>
//           </div>
//           <div>
//             <button className="button" onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/addaddress_btn', 1000)}>
//               <AddIcon className="buttonIcon" />
//               Add address
//               <ArrowForwardIosIcon className="arrowIcon" />
//             </button>
//             <button className="button" onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/createnewwallet_btn', 1000)}>
//               <FolderIcon className="buttonIcon" />
//               Create new wallet
//               <ArrowForwardIosIcon className="arrowIcon" />
//             </button>
//             <button className="button" onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/importwallet_btn', 1000)}>
//               <BiImport className="buttonIcon" />
//               <div className="buttonimportcls">
//                 <div className="buttonimport">Import a wallet</div>
//                 <div className="buttonDescription">Recovery phrase & private key</div>
//               </div>
//               <ArrowForwardIosIcon className="arrowIcon" />
//             </button>
//             <button className="button" onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/connectledger_btn', 1000)}>
//               <PlugIcon className="buttonIcon" />
//               Connect Ledger wallet
//               <ArrowForwardIosIcon className="arrowIcon" />
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ManageProfile;








'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { IconButton } from '@mui/material';
import { FaUserCircle } from 'react-icons/fa';
import { BiImport } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import PlugIcon from '@mui/icons-material/Power';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styles from './manageprofile.module.css'; // Ensure path is correct and CSS is global if needed
import { redirect } from 'next/navigation';


const ManageProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = useCallback((path: string, timeout = 1000) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, timeout);
}, [router]);

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <>
          <div className={styles.titleContainer}>
            <IconButton className={styles.backarrow} onClick={() => handleNavigation('/Userauthorization/Dashboard/Home')} sx={{ color: '#fff' }}>
              <ArrowBackIcon />
            </IconButton>
            <h1 className={styles.title}>Add & manage wallets</h1>
          </div>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>WALLET 1</h2>
            <button className={styles.button} onClick={() => handleNavigation('/Manageprofile/ViewProfile')}>
              <div className={styles.walletItem}>
                <FaUserCircle className={styles.profileIcon} />
                <div className={styles.walletInfo}>
                  <div className={styles.walletAddress}>srinivass7420.cb.id</div>
                  <div className={styles.walletBalance}>$0.00</div>
                </div>
                <ArrowForwardIosIcon className={styles.arrowIcon} />
              </div>
            </button>
          </div>
          <div>
            <button className={styles.button} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/addaddress_btn', 1000)}>
              <AddIcon className={styles.buttonIcon} />
              Add address
              <ArrowForwardIosIcon className={styles.arrowIcon} />
            </button>
            <button className={styles.button} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/createnewwallet_btn', 1000)}>
              <FolderIcon className={styles.buttonIcon} />
              Create new wallet
              <ArrowForwardIosIcon className={styles.arrowIcon} />
            </button>
            <button className={styles.button} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/importwallet_btn', 1000)}>
              <BiImport className={styles.buttonIcon} />
              <div className={styles.buttonimportcls}>
                <div className={styles.buttonimport}>Import a wallet</div>
                <div className={styles.buttonDescription}>Recovery phrase & private key</div>
              </div>
              <ArrowForwardIosIcon className={styles.arrowIcon} />
            </button>
            <button className={styles.button} onClick={() => handleNavigation('/Userauthorization/Dashboard/addmanagewallets_btn/connectledger_btn', 1000)}>
              <PlugIcon className={styles.buttonIcon} />
              Connect Ledger wallet
              <ArrowForwardIosIcon className={styles.arrowIcon} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProfile;
