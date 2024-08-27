// 'use client';
// import React from 'react';
// import './manageprofile.css';
// import IconButton from '@mui/material/IconButton';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const ManageProfile = () => {
//   const handleButtonClick = (message) => {
//     console.log(message);
//   };

//   const handleBackClick = () => {
//     console.log('Back button clicked');
//   };

//   return (
//     <div className="container">
//       <IconButton onClick={handleBackClick} sx={{ color: '#fff', marginRight: 25, marginLeft: -30 }}>
//         <ArrowBackIcon />
//       </IconButton>
//       <h1 className="title">Add & manage wallets</h1>
//       <div className="section">
//         <h2 className="sectionTitle">WALLET 1</h2>
//         <div className="walletItem">
//           <div className="walletIcon">
//             <img src="https://via.placeholder.com/40" alt="Profile Icon" style={{ borderRadius: '50%' }} />
//           </div>
//           <div>
//             <div>Address 1</div>
//             <div className="walletAddress">$0.00</div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Add address clicked')}
//         >
//           <span className="buttonIcon">+</span>
//           Add address
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Create new wallet clicked')}
//         >
//           <span className="buttonIcon">🗂️</span>
//           Create new wallet
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Import a wallet clicked')}
//         >
//           <span className="buttonIcon">🔑</span>
//           Import a wallet
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Connect Ledger wallet clicked')}
//         >
//           <span className="buttonIcon">🔌</span>
//           Connect Ledger wallet
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManageProfile;

// src/app/Dashboard/Manage/manageprofile.jsx
// 'use client';
// import React from 'react';
// import { IconButton } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AddIcon from '@mui/icons-material/Add';
// import FolderIcon from '@mui/icons-material/Folder';
// import KeyIcon from '@mui/icons-material/VpnKey';
// import PlugIcon from '@mui/icons-material/Power';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import './manageprofile.css';

// const ManageProfile = () => {
//   const handleButtonClick = (message) => {
//     console.log(message);
//   };

//   const handleBackClick = () => {
//     console.log('Back button clicked');
//   };

//   return (
//     <div className="container">
//       <IconButton onClick={handleBackClick} sx={{ color: '#fff', marginRight: 25, marginLeft: -30 }}>
//         <ArrowBackIcon />
//       </IconButton>
//       <h1 className="title">Add & manage wallets</h1>
//       <div className="section">
//         <h2 className="sectionTitle">WALLET 1</h2>
//         <div className="walletItem">
//           <div className="walletIcon">
//             {/* <Image src="https://via.placeholder.com/40" alt="Profile Icon" width={40} height={40} className="profileImage" /> */}
//           </div>               
//           <button className="button"onClick={() => handleButtonClick('Address 1 is clicked')} >
//           <AddIcon className="buttonIcon" />
          
//           <div className="userid">srinivass...cb.id</div>
//               <div className="walletAddress"> <span>$0.00</span> </div>
//               <div className="icons">
//               </div>
//         </button>
//         <div className="walletAddress">$0.00</div>
//         </div>
        
        
//       </div>
//       <div>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Add address clicked')}
//         >
//           <AddIcon className="buttonIcon" />
//           Add address
//           <ArrowForwardIosIcon className="arrowIcon" />
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Create new wallet clicked')}
//         >
//           <FolderIcon className="buttonIcon" />
//           Create new wallet
//           <ArrowForwardIosIcon className="arrowIcon" />
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Import a wallet clicked')}
//         >
//           <KeyIcon className="buttonIcon" />
//           Import a wallet
//           <ArrowForwardIosIcon className="arrowIcon" />
//         </button>
//         <button
//           className="button"
//           onClick={() => handleButtonClick('Connect Ledger wallet clicked')}
//         >
//           <PlugIcon className="buttonIcon" />
//           Connect Ledger wallet
//           <ArrowForwardIosIcon className="arrowIcon" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ManageProfile;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Use correct import for App Router
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import KeyIcon from '@mui/icons-material/VpnKey';
import PlugIcon from '@mui/icons-material/Power';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BiImport } from "react-icons/bi";
// import Image from 'next/image';
import './manageprofile.css';

const ManageProfile = () => {
  const router = useRouter(); // Initialize useRouter

  const handleButtonClick = (message) => {
    console.log(message);
  };

  const handleBackClick = () => {
    router.push('/Userauthorization/Dashboard'); // Navigate to WalletInterface page
  };

  return (
    <div className="container">
      <div className="titleContainer">
        <IconButton onClick={handleBackClick} sx={{ color: '#fff' }}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="title">Add & manage wallets</h1>
      </div>
      <div className="section">
        <h2 className="sectionTitle">WALLET 1</h2>
        <div className="walletItem">
          <div className="walletInfo">
            <div className="walletAddress">srinivass7420.cb.id</div>
            <div className="walletBalance">$0.00</div>
          </div>
          <ArrowForwardIosIcon className="arrowIcon" />
        </div>
      </div>
      <div>
        <button
          className="button"
          onClick={() => handleButtonClick('Add address clicked')}
        >
          <AddIcon className="buttonIcon" />
          Add address
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
        <button
          className="button"
          onClick={() => handleButtonClick('Create new wallet clicked')}
        >
          <FolderIcon className="buttonIcon" />
          Create new wallet
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
        
        <button
          className="button"
          onClick={() => handleButtonClick('Import a wallet clicked')}
        >
          <BiImport className="buttonIcon" />
          <div className='buttonimportcls'>
            <div className='buttonimport'>Import a wallet</div>
            <div className="buttonDescription">Recovery phrase & private key</div>
          </div>
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
        
        <button
          className="button"
          onClick={() => handleButtonClick('Connect Ledger wallet clicked')}
        >
          <PlugIcon className="buttonIcon" />
          Connect Ledger wallet
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
      </div>
    </div>
  );
};

export default ManageProfile;
