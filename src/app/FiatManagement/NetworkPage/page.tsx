"use client";
import React from 'react';
import NetworkSelector from './NetworkSelector'


const NetworkPage:React.FC = () => {
  return (
    <div className="container">
      <NetworkSelector />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          
        }
      `}</style>
    </div>
  );
};

export default NetworkPage;