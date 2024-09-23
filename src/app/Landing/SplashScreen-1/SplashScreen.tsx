import React from 'react';
import styles from './SplashScreen.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SplashScreen: React.FC = () => {
    const router = useRouter();
    
    const handleNavigation2 = () => {
        router.push('/Landing/SplashScreen-2'); // Updated route
    };
    
    const handleNavigation3 = () => {
        router.push('/Landing/SplashScreen-3'); // Updated route
    };

    return (
        <div className={styles.container}>
            <header>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            </header>
            <div className={styles.header}>
                <div className={styles.dots}>
                    <span className={`${styles.dot} ${styles.active}`}></span>
                    <span className={styles.dot} onClick={handleNavigation2}></span>
                    <span className={styles.dot} onClick={handleNavigation3}></span>
                </div>
                <div className={styles.skipButton}>Skip</div>
            </div>
        
            <div className={styles.content}>
                <div className={styles.graphics}>
                    <img src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804632/image-1_a0ff1x.png" alt="" />                    
                </div>
                <h1 className={styles.heading}>
                    The <span className={styles.highlight}>Future</span> of <br />
                    <span className={styles.highlights}>Money</span> is Here.
                </h1>
                <p className={styles.subheading}>
                    Step into the next generation of <br />
                    finance with Dupay.
                </p>

                <button className={styles.discoverButton} onClick={handleNavigation2}>Discover more</button>
            </div>
        </div>
    );
};

export default SplashScreen;
