
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SplashScreen.module.css';
import useSwipe from '../../useSwipe'; // Adjust the path as needed


const Oboarding = () => {
    const router = useRouter();
    const [isExiting, setIsExiting] = useState(false);

    const handleNavigation3 = () => {
        setIsExiting(true);
		router.push('/OnBoarding/SplashScreen-3');
    };

    const handleSwipeRight = () => {
        setIsExiting(true);
		router.push('/OnBoarding/SplashScreen-2');

    };

    const handleSkipClick = () => {
        setIsExiting(true);
		router.push('/Userauthentication/SignUp/EmailVerification');

    };

    

    return (
        <div className={`${styles.oboarding4} ${isExiting ? styles.slideExit : styles.slideEnter}`}>
            <div className={styles.carouselIndicator}>
                <img className={styles.imagecarouselIndicatorcompoIcon1} onClick={handleSwipeRight} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
                <img className={styles.imagecarouselIndicatorcompoIcon2} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
                <img className={styles.imagecarouselIndicatorcompoIcon} onClick={handleNavigation3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
            </div>
            <button className={styles.skip} onClick={handleSkipClick}>Skip</button>
            <div className={styles.titleParent}>
                <div className={styles.title}>
                    <span>The</span>
                    <span className={styles.future}> Future </span>
                    <span className={styles.of}> of </span>
                    <span className={styles.future1}>Money</span>
                    <span> is Here.</span>
                </div>
                <div className={styles.title1}>Step into the next generation of finance with Dupay.</div>
            </div>
            <button className={styles.getStartedButton} onClick={handleSwipeRight}>Discover more</button>
            <img className={styles.techbgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804632/image-1_a0ff1x.png" />
        </div>
    );
};

export default Oboarding;





