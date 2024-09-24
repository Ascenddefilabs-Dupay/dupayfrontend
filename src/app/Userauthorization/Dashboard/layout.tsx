import React, { ReactNode } from 'react';
import BottomNavBar from './BottomNavBar/BottomNavBar'; // Import actual BottomNavBar

interface BottomnavbarProps {
  children: ReactNode; // To handle any children passed inside Bottomnavbar
  showBottomNav?: boolean; // Optional boolean to control visibility of BottomNavBar
}

const Bottomnavbar: React.FC<BottomnavbarProps> = ({ children, showBottomNav = true }) => {
  return (
    <div>
      {children}
      {showBottomNav && ( // Conditionally render BottomNavBar if showBottomNav is true
        <footer>
          <BottomNavBar />
        </footer>
      )}
    </div>
  );
};

export default Bottomnavbar;
