import React from 'react';
import styles from './SplashScreen2.module.css';
import { useRouter } from 'next/navigation';

const SplashScreen2: React.FC = () => {
    const router = useRouter();
    
    const handleNavigation3 = () => {
        router.push('/OnBoarding/SplashScreen-3'); // Updated route
    };
    const handleNavigation1 = () => {
        router.push('/OnBoarding/SplashScreen-1'); // Updated route
    };
	const handleSkipClick = () => {
        router.push('/Userauthentication/SignUp/EmailVerification');
    };

  	return (
    		<div className={styles.oboarding5}>
      			<button className={styles.skip} onClick={handleSkipClick}>Skip</button>
      			<div className={styles.carouselIndicator}>
                  <img className={styles.imagecarouselIndicatorcompoIcon}  onClick={handleNavigation1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				
        				<img className={styles.imagecarouselIndicatorcompoIcon2} onClick={handleNavigation3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
      			</div>
                 
      			{/* <div className={styles.titleParent}>
        				<div className={styles.title}>
          					<span>{`Trusted by `}</span>
          					<span className={styles.individuals}>Individuals</span>{` `}
          					<span>{`&`}</span>
          					<span className={styles.individuals}> Businesses</span>
        				</div>
        				<div className={styles.titleWrapper}>
          					<div className={styles.title1}>The most reliable platform for your crypto needs.</div>
        				</div>
      			</div> */}
				  <div className={styles.textContent}>
						<h1 className={styles.title}>
						<span className={styles.highlight}> Trusted by</span>
							<br /> <span className={styles.highlighted}>Individuals &amp; Businesses</span>
							
						</h1>
						<p className={styles.subText}>The most reliable platform for <br/>
						ease of use.</p>
					</div>
      			<img className={styles.lockBgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727063179/2nd-screen_ms4not.png" />
			<button className={styles.getStartedButton} onClick={handleNavigation3}>See how it works</button>
      			
    		</div>)
};




export default SplashScreen2;
