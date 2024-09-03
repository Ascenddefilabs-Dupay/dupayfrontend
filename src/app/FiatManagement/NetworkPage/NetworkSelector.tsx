"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import networkOptions from './NetworkOptions';
import './NetworkSelector.css';
import { FaArrowLeft } from 'react-icons/fa';

interface NetworkOption {
    value: string;
    label: string;
}

const NetworkSelector: React.FC = () => {
    const router = useRouter();
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<NetworkOption[]>(networkOptions);

    useEffect(() => {
        const storedNetwork = localStorage.getItem('selectedNetwork');
        if (storedNetwork) {
            // Set initial state based on stored network if needed
            // For example, you could highlight the selected option
        }
    }, []);

    const handleLeftArrowClick = () => {
        window.location.href = '/FiatManagement/Currency_Conversion';
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        const filtered = networkOptions.filter(option =>
            option.label.toLowerCase().includes(query)
        );
        setFilteredOptions(filtered);
    };

    const handleNetworkSelect = (network: string) => {
        localStorage.setItem('selectedNetwork', network);
        router.back(); // Go back to the previous page
    };

    return (
        <div className="networkSelectorContainer">
            <div className="topBar">
                <button className="topBarButton">
                    <FaArrowLeft className="topBarIcon" onClick={handleLeftArrowClick} />
                </button>
                <h2 className="topBarTitle">Select Network</h2>
            </div>
            <div className="networkSelectorHeader">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="searchInput"
                />
            </div>
            <div className="networkOptionsList">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <div
                            key={option.value}
                            className="networkOption"
                            onClick={() => handleNetworkSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))
                ) : (
                    <div className="noResults">No results found</div>
                )}
            </div>
        </div>
    );
};

export default NetworkSelector;
