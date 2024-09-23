import React from 'react';
import styles from './SplashScreen2.module.css';
import { useRouter } from 'next/navigation';

const SplashScreen2: React.FC = () => {
    const router = useRouter();
    
    const handleNavigation3 = () => {
        router.push('/Landing/SplashScreen-3'); // Updated route
    };
    const handleNavigation1 = () => {
        router.push('/Landing/SplashScreen-1'); // Updated route
    };

    return (
        <div className={styles.container}>
            <header>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            </header>
            <div className={styles.header}>
                <div className={styles.dots}>
                    <span className={styles.dot} onClick={handleNavigation1}></span>
                    <span className={`${styles.dot} ${styles.active}`}></span>
                    <span className={styles.dot} onClick={handleNavigation3}></span>
                </div>
                <div className={styles.skipButton}>Skip</div>
            </div>
            <div className={styles.imageContainer}>
                <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804062/image_xnekfp.png" alt="" />
            </div>
            {/* Heading directly below header */}
            <div className={styles.textContainer}>
                <h1 className={styles.title}>
                    Trusted by <span className={styles.highlightText}>Individuals</span> &{' '}
                    <span className={styles.highlightTexts}>Businesses</span>
                </h1>
                <p className={styles.subTitle}>
                    The most reliable platform for <br /> your crypto needs.
                </p>
            </div>

            {/* Centered button */}
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleNavigation3}>See how it works</button>
            </div>
        </div>
    );
};

export default SplashScreen2;
