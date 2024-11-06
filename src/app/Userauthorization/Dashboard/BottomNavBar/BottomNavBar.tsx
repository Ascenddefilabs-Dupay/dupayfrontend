"use client"; // This marks the component as a client component

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import styles from './BottomNavBar.module.css';
import { redirect } from 'next/navigation';
const UserAuthorization = process.env.UserAuthorization




// Define types for NavItem props
interface NavItemProps {
  icon: JSX.Element;
  label?: string;
  isSelected: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isSelected, onClick }: NavItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.navItem} ${isSelected ? styles.selected : ''}`}
    >
      {icon}
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
};

// Optional: Lazy load icons with TypeScript
const HomeIcon = lazy(() => import('@mui/icons-material/Home').then(module => ({ default: module.default })));
const AssessmentIcon = lazy(() => import('@mui/icons-material/Assessment').then(module => ({ default: module.default })));
const FaRegUserCircle = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaRegUserCircle })));
const FiGlobe = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiGlobe })));

const BottomNavBar = () => {
  const [selected, setSelected] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const userId = 'DupC0001';

  // const [user, setUserProfile] = useState<UserProfileData>({ user_id: '' });


  useEffect(() => {
    // Update selected state based on current route
    if (pathname === '/Userauthorization/Dashboard/Home') {
      setSelected('home');
    } else if (pathname === '/Userauthorization/Dashboard/BottomNavBar/transaction_btn') {
      setSelected('transaction');
    } else if (pathname === '/Userauthorization/Dashboard/BottomNavBar/profileicon_btn') {
      setSelected('profileicon');
    } else if (pathname === '/Userauthorization/Dashboard/BottomNavBar/browser_btn') {
      setSelected('browser');
    }
  }, [pathname]);

  useEffect(() => {
    // Fetch the user profile image
    const fetchUserProfile = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await axios.get(`${UserAuthorization}/userauthorizationapi/profile/${userId}/`);
        if (response.data.user_profile_photo) {
          const baseURL = '/profile_photos';
          let imageUrl = '';

          if (typeof response.data.user_profile_photo === 'string' && response.data.user_profile_photo.startsWith('http')) {
            imageUrl = response.data.user_profile_photo;
          } else if (response.data.user_profile_photo && response.data.user_profile_photo.startsWith('/')) {
            imageUrl = `${baseURL}${response.data.user_profile_photo}`;
          } else if (response.data.user_profile_photo && response.data.user_profile_photo.data) {
            const byteArray = new Uint8Array(response.data.user_profile_photo.data);
            const base64String = btoa(
              byteArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            imageUrl = `data:image/jpeg;base64,${base64String}`;
          }

          setProfileImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleNavigation = (navItem: string) => {
    setSelected(navItem);
    const routeMap: Record<string, string> = {
      'home': '/Userauthorization/Dashboard/Home',
      'transaction': '/Userauthorization/Dashboard/BottomNavBar/transaction_btn',
      'profileicon': '/Userauthorization/Dashboard/BottomNavBar/profileicon_btn',
      'browser': '/Userauthorization/Dashboard/BottomNavBar/browser_btn',
    };
    router.push(routeMap[navItem]);
  };

  return (
    <div className={styles.bottomNavBar}>
      <Suspense fallback={<div>Loading...</div>}>
        <NavItem
          icon={<HomeIcon />}
          isSelected={selected === 'home'}
          onClick={() => handleNavigation('home')}
        />
        <NavItem
          icon={<FiGlobe style={{ fontSize: '24px' }} />}
          isSelected={selected === 'browser'}
          onClick={() => handleNavigation('browser')}
        />
        <NavItem
          icon={<AssessmentIcon />}
          isSelected={selected === 'transaction'}
          onClick={() => handleNavigation('transaction')}
        />
        <NavItem
          icon={
            profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '5px',
                  marginTop: '8px',
                  border: '2px solid white'
                }}
              />
            ) : (
              <FaRegUserCircle style={{ fontSize: '22px' }} />
            )
          }
          isSelected={selected === 'profileicon'}
          onClick={() => handleNavigation('profileicon')}
        />
      </Suspense>
    </div>
  );
};

export default BottomNavBar;
