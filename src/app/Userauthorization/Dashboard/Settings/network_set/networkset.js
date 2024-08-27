'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import '../network_set/net.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

    

const NetworkSet = () => {
    const [activeTab, setActiveTab] = useState('mainnets');
    const router = useRouter();

    const handleBackClicknet = () => {
        let redirectUrl = '/Userauthorization/Dashboard/Settings';
        router.push(redirectUrl);
      };
  
    return (
        <div className='network_container'>    
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
        </div>

    );
};

export default NetworkSet;