import { style } from '@mui/system';
import styles from './SplashScreen3.module.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSwipe from '../../useSwipe'; // Adjust the path as needed



export default function SplashScreen3() {
    const router = useRouter();
    const [isExiting, setIsExiting] = useState(false);

    const handleSwipeLeft = () => {
      setIsExiting(true);
        router.push('/OnBoarding/SplashScreen-1'); // Updated route
    };
    const handleSwipeRight = () => {
      setIsExiting(true);
      router.push('/OnBoarding/SplashScreen-2'); // Updated route
    };
    const navigateToSignUp = () => {
      setIsExiting(true);
      router.push('/Userauthentication/SignUp/EmailVerification'); // Updated route
    };

    useSwipe(handleSwipeLeft, handleSwipeRight);


  return (
    <div className={`${styles.container} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
     {/* <div className={`${styles.oboarding4} ${isExiting ? styles.slideExit : styles.slideEnter}`}> */}

      <div className={styles.carouselIndicator}>
          <img className={styles.imagecarouselIndicatorcompoIcon1} onClick={handleSwipeLeft}   alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
          <img className={styles.imagecarouselIndicatorcompoIcon2} onClick={handleSwipeRight} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6" />
          <img className={styles.imagecarouselIndicatorcompoIcon}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
      </div>
      <div className={styles.textContent}>
        <h1 className={styles.title}>
          <span className={styles.highlight}> Buy, Sell &amp;</span>
             <br /> <span className={styles.highlighted}>Manage</span> with <br />
             <span className={styles.highlights}>Confidence </span>
        </h1>
        <p className={styles.subText}>Industry-leading security and <br/>
          ease of use.</p>
      </div>
      <button className={styles.getStartedButton} onClick={navigateToSignUp}>Get started</button>
    </div>
  );
}