"use client";
import './SelectAsset.css';
import React, { useState, ChangeEvent } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

type Asset = {
  name: string;
  symbol: string;
  icon: string;
};

const assets: Asset[] = [
  { name: 'Ethereum', symbol: 'ETH', icon: '/path/to/ethereum-icon.png' },
  { name: 'USD Coin', symbol: 'USDC', icon: '/path/to/usd-coin-icon.png' },
  { name: 'Tether', symbol: 'USDT', icon: '/path/to/tether-icon.png' },
  { name: 'Uniswap', symbol: 'UNI', icon: '/path/to/uniswap-icon.png' },
  { name: 'Chainlink', symbol: 'LINK', icon: '/path/to/chainlink-icon.png' },
  { name: 'Wrapped Bitcoin', symbol: 'WBTC', icon: '/path/to/wrapped-bitcoin-icon.png' },
  { name: 'Shiba Inu', symbol: 'SHIB', icon: '/path/to/shiba-inu-icon.png' },
  // Add more assets as needed
];

const SelectAsset: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAssetSelect = (asset: Asset) => {
    // Perform any additional actions with the selected asset if needed
    console.log(`Selected asset: ${asset.name}`);
    router.back(); // Navigate back to the previous page
  };

  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLeftArrowClick = () => {
    window.location.href = '/FiatManagement/Currency_Conversion';
  };

  return (
    <div className="assetContainer">
      <div className="topBar">
        <button className="topBarButton">
          <FaArrowLeft className="topBarIcon" onClick={handleLeftArrowClick} />
        </button>
        <h2 className="topBarTitle">Select Asset To Buy</h2>
      </div>
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="searchInput"
        />
      </div>
      <div className="assetList">
        {filteredAssets.map((asset) => (
          <div className="assetItem" key={asset.symbol} onClick={() => handleAssetSelect(asset)}>
            {/* <img src={asset.icon} alt={asset.name} className="assetIcon" /> */}
            <div className="assetInfo">
              <div className="assetName">{asset.name}</div>
              <div className="assetSymbol">{asset.symbol}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectAsset;
