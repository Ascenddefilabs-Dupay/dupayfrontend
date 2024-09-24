'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../network_set/net.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';


    

const Networkmod = () => {
    const [activeTab, setActiveTab] = useState('mainnets');
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

    const handleBackClicknet = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
      };
  
    return (  
        <div className='network_card'>
            <div className="network_top-bar">
                <ArrowBackIcon className="arrow-circle-left-icon" onClick={handleBackClicknet} />
                <span className="title">Networks</span>
                <AddIcon className="add-icon" />
            </div>
            <div className="search-container">
                <SearchIcon className="search-icon" />
                <input id="search" type="text" placeholder="Search" />
            </div>
            <div className="tabs">
                <button 
                    className={`tab ${activeTab === 'mainnets' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('mainnets')}
                >
                    Mainnets
                </button>
                <button 
                    className={`tab ${activeTab === 'testnets' ? 'active' : ''}`} 
                    onClick={() => setActiveTab('testnets')}
                >
                    Testnets
                </button >
            </div>
            <div className="tab-content">
            {activeTab === 'mainnets' ? (
                <div>Mainnets Content</div>
            ) : (
                <div>Testnets Content</div>
            )}
            </div>
            
        </div>

    );
};

export default Networkmod;