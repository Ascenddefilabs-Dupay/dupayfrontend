'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../developerfrom/developer.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

const Developer = () => {
  const [testnetsEnabled, setTestnetsEnabled] = useState(false);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const sessionDataString = window.localStorage.getItem('session_data');
          if (sessionDataString) {
            const sessionData = JSON.parse(sessionDataString);
            const storedUserId = sessionData.user_id;
            setUserId( storedUserId);
            console.log(storedUserId);
            console.log(sessionData.user_email);
          } else {
            // redirect('http://localhost:3000/Userauthentication/SignIn');
          }
        }
      }, []);

  const toggleTestnets = () => {
    setTestnetsEnabled(!testnetsEnabled);
  };

  const handleBackClick = () => {
    let redirectUrl = '/Cryprto_Wallet/Dashboard/Settings';
    router.push(redirectUrl);
  };

  return (
    <div className="container">
        <div className="developer_card">
            <div className="header">
                <ArrowBackIcon className="back-icon" onClick={handleBackClick}  />
                <span>Developer settings</span>
            </div>
            <div className="setting">
                <div className="setting-info">
                    <span className="setting-title4">Testnets</span>
                    <span className="setting-description">Turn on testnets & testnet balances</span>
                </div>
                    <label className="switch">
                    <input type="checkbox" checked={testnetsEnabled} onChange={toggleTestnets} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className="develop_card1">
                <button className='private_key'>
                    <span className="private">Show private key</span>
                    <ChevronRightIcon className="private_icon" />
                </button>
            </div>
            
            <div className="develop_card2">
                <button className='export_net'>
                    <span className="export">Export custom networks</span>
                    <LibraryAddIcon className="develop-icon" />
                </button>
            </div>

            <div className="develop_crad3">
                <button className='wallet_document'>
                    <span className="wallet">Wallet Documentation</span>
                    <OpenInNewIcon className="wallet_icon" />
                </button>
            </div>
            
        </div>
    </div>

  );
};

export default Developer;