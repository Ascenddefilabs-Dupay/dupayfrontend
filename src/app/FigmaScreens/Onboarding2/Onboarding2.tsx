"use client";
import type { NextPage } from 'next';
import styles from './Onboarding2.module.css';
import { useRouter } from 'next/navigation';

const Oboarding2:NextPage = () => {

	const router = useRouter();
    
    const handleNavigation3 = () => {
        router.push('/FigmaScreens/Onboarding3'); // Updated route
    };
    const handleNavigation1 = () => {
        router.push('/FigmaScreens/Onboarding1'); // Updated route
    };
	const handleSkipClick = () => {
        router.push('/FigmaScreens/SignUp');
    };
  	return (
    		<div className={styles.oboarding5}>
      			<div className={styles.homeScreenBackground}>
        				<div className={styles.background} />
      			</div>
      			<div className={styles.skip} onClick={handleSkipClick}>Skip</div>
      			<div className={styles.carouselIndicator}>
        				<img className={styles.imagecarouselIndicatorcompoIcon} onClick={handleNavigation1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon1} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097939/0fb5d95e-5436-4573-8e7e-1f483c09a1f6.png" />
        				<img className={styles.imagecarouselIndicatorcompoIcon2} onClick={handleNavigation3} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727097900/7a0e1444-2ce5-45b2-b41e-c6bf2c442382.png" />
      			</div>
                  <img className={styles.groupIcon}  alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1726804062/image_xnekfp.png" />
      			<div className={styles.titleParent}>
        				<div className={styles.title}>
          					<span>{`Trusted by `}</span>
          					<span className={styles.individuals}>Individuals</span>{` `}
          					<span>{`&`}</span>
          					<span className={styles.individuals}> Businesses</span>
        				</div>
        				<div className={styles.titleWrapper}>
          					<div className={styles.title1}>The most reliable platform for your crypto needs.</div>
        				</div>
      			</div>
      			<img className={styles.lockBgIcon} alt="" src="https://res.cloudinary.com/dgfv6j82t/image/upload/v1727063179/2nd-screen_ms4not.png" />
      			<div className={styles.btnmbBtnFab}>
        				<div className={styles.btnbtn} onClick={handleNavigation3}>
          					<div className={styles.text}>See how it works</div>
        				</div>
      			</div>
      			{/* <div className={styles.systembar}>
        				<div className={styles.google}>Google</div>
        				<div className={styles.systembarChild} />
        				<div className={styles.systembarItem} />
        				<img className={styles.systembarInner} alt="" src="Ellipse 2.svg" />
        				<img className={styles.vectorIcon} alt="" src="Vector 1.svg" />
        				<img className={styles.unionIcon} alt="" src="Union.svg" />
      			</div> */}

    		</div>);
};

export default Oboarding2;
