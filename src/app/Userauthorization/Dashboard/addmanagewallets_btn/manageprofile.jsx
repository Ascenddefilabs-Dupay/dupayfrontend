'use client';
import React, { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import KeyIcon from '@mui/icons-material/VpnKey';
import PlugIcon from '@mui/icons-material/Power';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BiImport } from "react-icons/bi";
import { useRouter } from 'next/navigation';
import './manageprofile.css';

const ManageProfile = () => {
  const router = useRouter();

  const handleButtonClick = (message) => {
    console.log(message);    
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    router.push('/Userauthorization/Dashboard')
  };

  const navigateToWalletDetails = () => {
    router.push('/Manageprofile/ViewProfile')
    // Add your navigation logic here
  };

  const navigateToAddAddress= () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn/addaddress_btn', '/wallet')
    // Add your navigation logic here
  };
  
  const navigateToCreateWallet = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn/createnewwallet_btn');
  };  

  const navigateToImportWallet = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn/importwallet_btn', '/wallet')
    // Add your navigation logic here
  };

  const navigateToCreateLedgerWallet = () => {
    router.push('/Userauthorization/Dashboard/addmanagewallets_btn/connectledger_btn')
  };
  
  useEffect(() => {
    // Ensure that navigation actions are wrapped in useEffect
  }, [router]);

  return (
    <div className="container">
      <div className="titleContainer">
        <IconButton className="backarrow" onClick={handleBackClick} sx={{ color: '#fff' }}>
          <ArrowBackIcon />
        </IconButton>
        <h1 className="title">Add & manage wallets</h1>
      </div>
      <div className="section">
        <h2 className="sectionTitle">WALLET 1</h2>
        <button
          className="button"
          onClick={navigateToWalletDetails}
        >
          <div className="walletItem">
          <FaUserCircle className="profileIcon" />
            <div className="walletInfo">   
              <div className="walletAddress">srinivass7420.cb.id</div>
              <div className="walletBalance">$0.00</div>
            </div>
            <ArrowForwardIosIcon className="arrowIcon" />   
          </div>
        </button> 
      </div>
      <div>
        <button
          className="button"
          onClick={navigateToAddAddress }
        >
          <AddIcon className="buttonIcon" />
          Add address
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
        <button
          className="button"
          onClick={navigateToCreateWallet}
        >
          <FolderIcon className="buttonIcon" />
          Create new wallet
          <ArrowForwardIosIcon className="arrowIcon" />
        </button>
        
        <button
          className="button"
          onClick={navigateToImportWallet}
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
          onClick={() => navigateToCreateLedgerWallet('Connect Ledger wallet clicked')}
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
